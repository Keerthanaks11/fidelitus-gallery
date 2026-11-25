import { Label, RevealLines, RevealImage, Rise } from "./common.jsx";
import room from "../../assets/image_5.jpg";
import queen from "../../assets/07.jpeg";

/* 01 — Concept: a quiet statement, two drifting images */
export default function Concept() {
  return (
    <section id="concept" className="su-sec">
      <div className="su-wrap">
        <Label no="01">Concept</Label>

        <div style={{ display: "grid", gap: 56, marginTop: 56 }} className="su-concept">
          <div>
            <RevealLines
              lines={["Art is not meant", "to hang quietly.", "It should breathe,", "glow and live", "alongside you."]}
            />
            <Rise delay={0.2}>
              <p className="su-text" style={{ marginTop: 40 }}>
                Since 2014, Fidelitus Gallery has brought hand-painted Indian art out of the frame and into everyday
                life. From our gallery at Brigade Software Park in Bengaluru we show realistic, modern, contemporary and
                abstract works — led by our Chief Artist, Kotegadde S Ravi.
              </p>
              <p className="su-text">
                Every painting here is an original, made by hand, meant to be lived with — in homes, offices and the
                spaces where people gather.
              </p>
            </Rise>
          </div>

          <div className="su-concept-imgs">
            <RevealImage src={room} alt="Inside Fidelitus Gallery" ratio="4 / 5" />
            <RevealImage src={queen} alt="Painting from the collection" ratio="3 / 4" parallax={90} className="su-concept-small" />
          </div>
        </div>
      </div>

      <style>{`
@media (min-width: 900px) { .su-concept { grid-template-columns: 1.1fr 1fr; align-items: start; gap: 80px; } }
.su-concept-imgs { position: relative; padding-bottom: 18%; }
.su-concept-imgs > :first-child { width: 78%; margin-left: auto; }
.su-concept-small { position: absolute !important; left: 0; bottom: 0; width: 46%; box-shadow: 0 40px 70px -30px rgba(0,0,0,.8); }
`}</style>
    </section>
  );
}
