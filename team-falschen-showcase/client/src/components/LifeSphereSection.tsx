/* LifeSphere section per target spec: section header, intro grid (desc + raster readout),
 * subsystem cards with glossary tooltips, tech-stack carousel, recognition carousel, CTA buttons.
 * All in the existing Fälschen palette — navy ink, paper field, phosphor accent, 3px borders.
 */
import { Glossary } from "@/components/Glossary";
import { InfiniteMovingCards, LogoLoop, SectionHeading } from "@/components/Marquee";
import { IconArrowUpRight } from "@tabler/icons-react";
import {
  AWARDS,
  GLOSSARY,
  LIFESPHERE_SITE_URL,
  PAPER_URL,
  SUBSYSTEMS,
  TECH_STACK,
} from "@/data/lifesphere";

const lifesphereMark = "/assets/lifesphere-mark.svg";

export default function LifeSphereSection() {
  return (
    <section className="lifesphere-section section-pad" id="lifesphere" aria-labelledby="lifesphere-title">
      <div className="lifesphere-grid-bg" aria-hidden="true" />
      <div className="container">
        <SectionHeading index="SEC 01" kicker="THE SPOTLIGHT OF THIS YEAR" title="LIFESPHERE" id="lifesphere-title" />

        {/* 1. Introduction grid: description + ASCII/raster readout */}
        <div className="ls-intro">
          <div className="ls-intro-copy">
            <p className="lede">Five subsystems. One caregiving ecosystem.</p>
            <p className="body-copy">
              LifeSphere is an AI-powered autonomous caregiving ecosystem designed to sense, interpret, and respond. The system links wearable telemetry, robotics, emotion intelligence, home security, and automation into one accountable loop.
            </p>
            <p className="body-copy ls-recog">
              Recognized with eleven national and international awards, including Gold at the International Science Innovation Fair 2025 in Bali and selection as WICE 2025 international representative.
            </p>
          </div>
          <aside className="ls-raster panel-flat">
            <div className="ls-raster-head mono"><span>LIFESPHERE MARK / RASTER READOUT</span></div>
            <div className="ls-raster-art" aria-hidden="true">
              <img src={lifesphereMark} alt="" className="ls-raster-img" />
            </div>
            <div className="ls-raster-foot mono"><span>RES / 16×16</span><span className="accent-text">● SIGNAL</span></div>
          </aside>
        </div>

        {/* 2. Subsystem cards (first card spans two columns as the featured system) */}
        <div className="ls-cards">
          {SUBSYSTEMS.map((sys, i) => (
            <article key={sys.id} className={`ls-card panel-flat ${i === 0 ? "ls-card-featured" : ""}`}>
              <header className="ls-card-head mono">
                <span className="ls-card-id">{sys.id}</span>
                <span className="ls-card-status accent-text">● ACTIVE</span>
              </header>
              <h3 className="ls-card-name">{sys.name}</h3>
              <p className="ls-card-role mono">{sys.role}</p>
              <ul className="ls-card-specs">
                {sys.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              {sys.glossary.length > 0 && (
                <div className="ls-card-glossary mono">
                  <span className="ls-glossary-label">JARGON</span>
                  {sys.glossary.map((term) => (
                    <Glossary key={term} term={term} definition={GLOSSARY[term] ?? ""} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* 3. Tech stack carousel */}
        <div className="ls-stack">
          <span className="ls-stack-label mono">TECH STACK / LOOP</span>
          <LogoLoop items={TECH_STACK} duration={38} />
        </div>

        {/* 4. Recognition carousel */}
        <div className="ls-recognition">
          <span className="ls-recognition-label mono">RECOGNITION / 11 AWARDS</span>
          <InfiniteMovingCards items={AWARDS} duration={48} />
        </div>

        {/* 5. Call-to-action buttons */}
        <div className="ls-cta">
          <a href={PAPER_URL} className="sharp-button sharp-button-dark">
            Visit the research paper <IconArrowUpRight size={17} strokeWidth={2.5} />
          </a>
          <a href={LIFESPHERE_SITE_URL} target="_blank" rel="noopener noreferrer" className="sharp-button">
            Visit the LifeSphere site <IconArrowUpRight size={17} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
