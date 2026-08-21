/* Signal Forge page: Swiss-grid composition, sharp 3px borders, navy ink, phosphor signal, restrained CRT motion.
 * Revamped per target spec: rebuilt LifeSphere section, refined navbar, two-column sidebar footer,
 * real-asset preloader lockup. Hero, research, team, contact sections retain their established styling.
 */
import { useEffect, useState } from "react";
import { IconArrowUpRight, IconChevronUp, IconMenu2 } from "@tabler/icons-react";
import { motion } from "motion/react";
import NavbarDemo from "@/components/resizable-navbar-demo";
import StaircaseLoader from "@/components/StaircaseLoader";
import LifeSphereSection from "@/components/LifeSphereSection";
import SiteFooter from "@/components/SiteFooter";

const logoUrl = "/assets/falschen-mark.svg";
const heroArt = "/assets/falschen-hero-globe.svg";
const researchArt = "/assets/falschen-research-schematic.svg";

const founderProfiles = [
  {
    index: "F-01",
    name: "Faiyaz Bin Iqbal",
    role: "Founder",
    achievements: [
      "WICE 2025 international representative",
      "GRIC selected",
      "ALOHA International Math Challenge Runner-Up",
      "Top 10 internationally in multiple LeetCode and Codeforces contests",
      "7th place, Team Fälschen, The Reply AI Agent Competition, out of 3,143 teams",
      "Gold Medalist, International Science Innovation Fair 2025, Bali",
      "International Scratch Olympiad Runner-Up",
      "Codeavour 7.0 selected",
      "Robotics and Coding mentor, 50+ trainees",
    ],
  },
  {
    index: "F-02",
    name: "Samin Yeasar",
    role: "Co-Founder",
    achievements: [
      "Top 10 placer, International Academic Research Competition",
      "Bronze Medalist, international computer science competition, 3,000+ participants",
      "Multiple international online hackathon finalist",
      "Codeavour 7.0 selected",
      "International English Olympiad finalist",
      "7th place, Team Fälschen, The Reply AI Agent Competition, out of 3,143 teams",
    ],
  },
];

function SectionKicker({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return (
    <div className="section-kicker">
      <span className="kicker-number">{number}</span>
      <span className="kicker-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Home() {
  const [showDock, setShowDock] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactState, setContactState] = useState<"idle" | "error" | "success">("idle");

  useEffect(() => {
    const onScroll = () => setShowDock(window.scrollY > window.innerHeight * 0.62);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    if (!email.includes("@") || message.trim().length < 12) {
      setContactState("error");
      return;
    }
    setContactState("success");
    form.reset();
  };

  return (
    <div className="site-shell">
      {isLoading && (
        <StaircaseLoader
          backgroundColor="#0f1b2d"
          onDone={() => setIsLoading(false)}
          logo={
            <div className="loader-lockup">
              <img src={logoUrl} alt="Team Fälschen anvil and hammer mark" className="loader-mark" />
              <div className="loader-word mono">FÄLSCHEN</div>
            </div>
          }
        />
      )}
      <a className="skip-link" href="#main-content">Skip to content</a>
      <NavbarDemo menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main id="main-content">
        <section className="hero-section" id="top" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true" style={{ backgroundImage: `url(${heroArt})` }} />
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-meta mono"><span>TF / 001</span><span>BIIN SHOWCASE / 2025</span></div>
            <div className="hero-copy">
              <div className="hero-mark-wrap">
                <img src={logoUrl} alt="Team Fälschen anvil and hammer mark" className="hero-mark" />
              </div>
              <p className="eyebrow mono">Two researcher-engineers / robotics · physics · AI</p>
              <h1 id="hero-title">FORGED.<br /><span>WIRED.</span><br />PERFECTED.</h1>
              <p className="hero-positioning">A two-person research team building systems that connect the physical world, human signals, and intelligent machines.</p>
              <div className="hero-actions">
                <a href="#lifesphere" className="sharp-button sharp-button-dark">Trace the build <IconArrowUpRight size={17} strokeWidth={2.5} /></a>
                <a href="#research" className="text-link mono">Read the research <span>↘</span></a>
              </div>
            </div>
            <div className="hero-readout mono" aria-label="Project readout">
              <span className="readout-line"><i /> SIGNAL ONLINE</span>
              <span>LAT 23.8103° N</span>
              <span>LON 90.4125° E</span>
              <span>BUILD / 2025—26</span>
            </div>
          </div>
        </section>

        <LifeSphereSection />

        <section className="research-section section-pad" id="research" aria-labelledby="research-title">
          <div className="research-art" aria-hidden="true" style={{ backgroundImage: `url(${researchArt})` }} />
          <div className="container">
            <SectionKicker number="02" eyebrow="RESEARCH LOG / CONTINUOUS" title="Entropia → Convergō" />
            <div className="research-grid">
              <article className="research-card research-card-past">
                <div className="card-index mono">R-01 / PAST PROJECT</div>
                <h3>Entropia</h3>
                <p>Quantum mechanics research exploring single-particle manipulation and control.</p>
                <div className="card-foot mono"><span>PHASE / COMPLETE</span><span>↗ ARCHIVE</span></div>
              </article>
              <div className="research-arrow mono" aria-hidden="true">→</div>
              <article className="research-card research-card-current">
                <div className="card-index mono accent-text">R-02 / CURRENT PROJECT</div>
                <h3>Convergō</h3>
                <p>Mach-Zehnder interferometer research studying visibility invariance under large phase accumulation, targeting ISEF.</p>
                <div className="card-foot mono"><span>PHASE / ACTIVE</span><span className="accent-text">● SIGNAL</span></div>
              </article>
            </div>
            <p className="peer-note mono">PEER REVIEWER CREDIT / ABDUS SAMI AKANDA / RESEARCH PEER REVIEWER</p>
          </div>
        </section>

        <section className="team-section section-pad" id="team" aria-labelledby="team-title">
          <div className="container">
            <SectionKicker number="03" eyebrow="TEAM / TWO OPERATORS" title="Built together" />
            <div className="team-heading-row"><p className="lede">Two researcher-engineers who have built and competed together across robotics, physics, and AI for years.</p><span className="mono team-coord">TEAM / 02<br />STATUS / ALIGNED</span></div>
            <div className="founder-grid">
              {founderProfiles.map((founder) => (
                <article className="founder-sheet" key={founder.name}>
                  <div className="sheet-head mono"><span>{founder.index}</span><span>PROFILE / SPEC</span></div>
                  <h3>{founder.name}</h3>
                  <p className="founder-role mono">{founder.role}</p>
                  <div className="sheet-rule" />
                  <ul>{founder.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div><SectionKicker number="04" eyebrow="OPEN CHANNEL / CONTACT" title="Talk to the team" /><p className="body-copy contact-copy">For judges, collaborators, and technical questions, send a short note. We read every message as part of the build.</p></div>
            <form className="contact-form" onSubmit={submitContact} noValidate>
              <label className="mono" htmlFor="email">YOUR EMAIL</label>
              <input id="email" name="email" type="email" autoComplete="email" required placeholder="name@domain.com" />
              <label className="mono" htmlFor="message">YOUR MESSAGE</label>
              <textarea id="message" name="message" required minLength={12} placeholder="What should we build or discuss?" rows={5} />
              <button className="sharp-button sharp-button-dark" type="submit">Transmit note <IconArrowUpRight size={17} /></button>
              {contactState === "error" && <p className="form-status form-error" role="alert">Check your email and write at least 12 characters.</p>}
              {contactState === "success" && <p className="form-status form-success" role="status">Message captured. Thank you for reaching out to Team Fälschen.</p>}
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />

      <motion.div className={`floating-dock ${showDock ? "is-visible" : ""}`} initial={false} animate={{ y: showDock ? 0 : 100, opacity: showDock ? 1 : 0 }} aria-hidden={!showDock}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Go to top"><IconChevronUp size={18} /></button>
        <a href="#lifesphere" className="mono"><span>INDEX</span><IconMenu2 size={17} /></a>
        <span className="dock-signal mono"><i /> ONLINE</span>
      </motion.div>
    </div>
  );
}

export default Home;
