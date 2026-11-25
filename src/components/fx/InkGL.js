/* =====================================================================
   InkGL — tiny WebGL renderer (no three.js needed)
   Shows one image at a time and moves between images with a
   noise "ink / flame" dissolve. Also adds:
   - a soft ripple that follows the mouse
   - a slow "wind" drift so the picture always feels alive
   - a bend that reacts to scroll speed
   - film grain + vignette
   Usage:
     const gl = new InkGL(canvas, urls); await gl.ready; gl.start();
     gl.goTo(index) / gl.next() / gl.setMouse(x, y) / gl.setVelocity(v) / gl.destroy()
   ===================================================================== */

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() { vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uA, uB;
uniform vec2 uRes, uSizeA, uSizeB, uMouse;
uniform float uProg, uTime, uHover, uVel, uSat, uSmoke;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
// object-fit: cover
vec2 cover(vec2 uv, vec2 res, vec2 img) {
  float rs = res.x / res.y, ri = img.x / img.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);

  // mouse ripple
  vec2 d = (uv - uMouse) * asp;
  float dist = length(d);
  float rip = sin(dist * 26.0 - uTime * 3.0) * exp(-dist * 4.5) * 0.010 * uHover;
  uv += (d / (dist + 1e-4)) / asp * rip;

  // slow wind drift
  float n1 = fbm(uv * 2.2 + vec2(uTime * 0.045, -uTime * 0.03));
  float n2 = fbm(uv * 2.2 + vec2(7.3, 2.1) + uTime * 0.035);
  uv += (vec2(n1, n2) - 0.5) * 0.010;

  // scroll bend
  uv.y += sin(uv.x * 3.14159) * uVel * 0.035;

  // ink dissolve between A and B
  float t = uProg;
  float m = fbm(vUv * 3.0 + vec2(0.0, uTime * 0.05));
  float edgeMove = t * 1.4 - 0.2;
  float mask = smoothstep(m - 0.08, m + 0.08, edgeMove);
  vec2 disp = (vec2(n1, n2) - 0.5) * 0.22;
  vec3 a = texture2D(uA, cover(uv + disp * t, uRes, uSizeA)).rgb;
  vec3 b = texture2D(uB, cover(uv - disp * (1.0 - t), uRes, uSizeB)).rgb;
  vec3 col = mix(a, b, mask);

  // glowing "burning" edge while the dissolve runs
  float edge = 1.0 - abs(mask * 2.0 - 1.0);
  col += vec3(1.0, 0.52, 0.18) * pow(edge, 5.0) * 0.55 * sin(t * 3.14159);

  // charcoal smoke: slow dark wisps drifting upward
  float s = fbm(vUv * vec2(2.0, 3.2) + vec2(uTime * 0.025, -uTime * 0.07));
  float s2 = fbm(vUv * 5.0 + vec2(-uTime * 0.04, -uTime * 0.11) + s);
  col = mix(col, col * 0.28, smoothstep(0.42, 0.85, s * 0.7 + s2 * 0.5) * uSmoke);
  col += vec3(1.0, 0.45, 0.15) * smoothstep(0.78, 0.95, s2) * 0.06 * uSmoke; // faint embers

  // desaturate (SUMI-style muted colour)
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, uSat);

  // vignette + grain
  float vig = smoothstep(1.15, 0.25, length((vUv - 0.5) * vec2(1.1, 1.0)));
  col *= mix(0.62, 1.0, vig);
  col += (hash(vUv * uRes + fract(uTime) * 97.0) - 0.5) * 0.045;

  gl_FragColor = vec4(col, 1.0);
}
`;

const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export default class InkGL {
  constructor(canvas, urls, { duration = 1.9, saturation = 1, smoke = 0 } = {}) {
    this.saturation = saturation;
    this.smoke = smoke;
    this.canvas = canvas;
    this.urls = urls;
    this.duration = duration;
    this.cur = 0;
    this.nextIdx = 0;
    this.prog = 0;
    this.anim = null;
    this.mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    this.hover = 0;
    this.hoverTarget = 0;
    this.vel = 0;
    this.velTarget = 0;
    this.running = false;
    this.t0 = performance.now();

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL not available");
    this.gl = gl;

    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    this.program = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.buf = buf;

    this.u = {};
    ["uA", "uB", "uRes", "uSizeA", "uSizeB", "uMouse", "uProg", "uTime", "uHover", "uVel", "uSat", "uSmoke"].forEach(
      (n) => (this.u[n] = gl.getUniformLocation(prog, n))
    );
    gl.uniform1i(this.u.uA, 0);
    gl.uniform1i(this.u.uB, 1);

    this.textures = [];
    this.ready = Promise.all(urls.map((u) => this.load(u))).then((list) => {
      if (this.destroyed) { list.forEach((t) => this.gl.deleteTexture(t.tex)); return; }
      this.textures = list;
      this.resize();
      this.draw();
    });

    this.onResize = () => this.resize();
    window.addEventListener("resize", this.onResize);
  }

  load(url) {
    const gl = this.gl;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        resolve({ tex, w: img.naturalWidth, h: img.naturalHeight });
      };
      img.onerror = () => reject(new Error("image failed: " + url));
      img.src = url;
    });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
  }

  goTo(i) {
    if (!this.textures.length || this.anim) return false;
    const n = this.textures.length;
    i = ((i % n) + n) % n;
    if (i === this.cur) return false;
    this.nextIdx = i;
    this.anim = { start: performance.now() };
    if (!this.running) this.draw();
    return true;
  }
  next() { return this.goTo(this.cur + 1); }
  prev() { return this.goTo(this.cur - 1); }

  setMouse(x, y) {
    this.mouse.tx = x;
    this.mouse.ty = y;
    this.hoverTarget = 1;
    clearTimeout(this.hoverOff);
    this.hoverOff = setTimeout(() => (this.hoverTarget = 0), 900);
  }
  leave() { this.hoverTarget = 0; }
  setVelocity(v) { this.velTarget = Math.max(-1, Math.min(1, v)); }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  draw() {
    const gl = this.gl;
    if (this.destroyed || !this.textures.length) return;
    gl.useProgram(this.program); // the canvas context can be shared after a remount
    const now = performance.now();

    if (this.anim) {
      const k = Math.min(1, (now - this.anim.start) / 1000 / this.duration);
      this.prog = easeInOutCubic(k);
      if (k >= 1) {
        this.cur = this.nextIdx;
        this.prog = 0;
        this.anim = null;
        this.onChange && this.onChange(this.cur);
      }
    }
    const m = this.mouse;
    m.x += (m.tx - m.x) * 0.08;
    m.y += (m.ty - m.y) * 0.08;
    this.hover += (this.hoverTarget - this.hover) * 0.05;
    if (this.velocitySource) this.velTarget = this.velocitySource();
    else this.velTarget *= 0.9;
    this.vel += (this.velTarget - this.vel) * 0.1;

    const A = this.textures[this.cur];
    const B = this.textures[this.anim ? this.nextIdx : this.cur];
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, B.tex);
    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.u.uSizeA, A.w, A.h);
    gl.uniform2f(this.u.uSizeB, B.w, B.h);
    gl.uniform2f(this.u.uMouse, m.x, m.y);
    gl.uniform1f(this.u.uProg, this.prog);
    gl.uniform1f(this.u.uTime, (now - this.t0) / 1000);
    gl.uniform1f(this.u.uHover, this.hover);
    gl.uniform1f(this.u.uVel, this.vel);
    gl.uniform1f(this.u.uSat, this.saturation);
    gl.uniform1f(this.u.uSmoke, this.smoke);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    clearTimeout(this.hoverOff);
    window.removeEventListener("resize", this.onResize);
    const gl = this.gl;
    this.textures.forEach((t) => gl.deleteTexture(t.tex));
    gl.deleteBuffer(this.buf);
    gl.deleteProgram(this.program);
  }
}
