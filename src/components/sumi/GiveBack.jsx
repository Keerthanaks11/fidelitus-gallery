import { Link } from "react-router-dom";
import { Label, RevealLines, RevealImage, Rise, SU } from "./common.jsx";
import workshop from "../../assets/12.jpg";
import easels from "../../assets/image_8.jpg";

/* 05 — Story: art that gives back (Shilpa Foundation) + an invitation to visit */
export default function GiveBack() {
  return (
    <>
      <section id="story" className="su-sec">
        <div className="su-wrap">
          <Label no="05">Story</Label>
          <div className="gb">
            <div>
              <Rise>
                <p className="gb-num" aria-label="25 percent">25<span>%</span></p>
              </Rise>
              <RevealLines lines={["of every purchase", "supports Shilpa Foundation."]} />
              <Rise delay={0.2}>
                <p className="su-text" style={{ marginTop: 32 }}>
                  Shilpa Foundation is a non-profit founded by Fidelitus Corp Property Services Pvt Ltd. When you bring
                  a painting home, a quarter of its value goes towards the education of underprivileged children.
                </p>
              </Rise>
            </div>
            <RevealImage src={workshop} alt="An art workshop at Fidelitus Gallery" ratio="16 / 10" />
          </div>
        </div>
      </section>

      <section className="su-sec gb-visit">
        <RevealImage src={easels} alt="" ratio="auto" parallax={80} className="gb-visit-bg" style={{ position: "absolute", inset: 0 }} />
        <div className="su-wrap" style={{ position: "relative", textAlign: "center" }}>
          <Label no="06">Visit</Label>
          <RevealLines lines={["Come and stand", "in front of the real thing."]} className="su-big gb-visit-title" />
          <Rise delay={0.2}>
            <p className="su-text" style={{ margin: "24px auto 0" }}>
              Brigade Software Park, No. 42, B Block, 27th Cross, Banashankari 2nd Stage, Bengaluru
            </p>
            <div style={{ marginTop: 36 }}>
              <Link to="/contact" className="su-link">Plan your visit <span aria-hidden>→</span></Link>
            </div>
          </Rise>
        </div>
      </section>

      <style>{`
.gb { display: grid; gap: 56px; margin-top: 40px; align-items: center; }
@media (min-width: 900px) { .gb { grid-template-columns: 1fr 1fr; gap: 80px; } }
.gb-num { margin: 0; font-family: "Cormorant Garamond", Georgia, serif; font-weight: 400; font-size: clamp(110px, 15vw, 220px);
  line-height: .9; color: ${SU.ember}; }
.gb-num span { font-size: .45em; margin-left: .05em; }
.gb-visit { padding: 180px 0; overflow: hidden; }
.gb-visit-bg img { opacity: .2; }
.gb-visit .su-label { justify-content: center; }
.gb-visit-title { margin-top: 28px !important; font-size: clamp(32px, 4.4vw, 68px) !important; }
`}</style>
    </>
  );
}
