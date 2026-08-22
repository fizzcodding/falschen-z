/* Signal Forge page: Swiss-grid composition, sharp 3px borders, navy ink, phosphor signal, restrained CRT motion.
 * Revamped per target spec: rebuilt LifeSphere section, refined navbar, two-column sidebar footer,
 * real-asset preloader lockup. Hero, research, team, contact sections retain their established styling.
 * Scroll animations: Lenis smooth scroll, whole-page RevealSection with stagger, 3D rolling countdown.
 */
import { useEffect, useRef, useState } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ReactLenis from "lenis/react";
import NavbarDemo from "@/components/resizable-navbar-demo";
import StaircaseLoader from "@/components/StaircaseLoader";
import LifeSphereSection from "@/components/LifeSphereSection";
import SiteFooter from "@/components/SiteFooter";
import { ScrollRevealText } from "@/components/ScrollRevealText";

const logoUrl = "/assets/falschen-anvil.svg";
const heroArt = "/assets/falschen-hero-globe.png";
const researchArt = "/assets/falschen-research-schematic.png";
const teamArt = "/assets/creation_of_adam.png";

const COUNTDOWN_TARGET = new Date("2026-08-29T16:00:00").getTime();

const founderProfiles = [
  {
    index: "F-01",
    name: "Faiyaz Bin Iqbal",
    role: "Founder",
    achievements: [
      "Gold Medal at WICE 2025 (World Invention Competition and Exhibition 2025)",
      "Global Robotics and Innovation Consortium 2026 selected",
      "ALOHA International Math Challenge Runner-Up",
      "Top 10 internationally in multiple LeetCode and Codeforces contests",
      "Gold Medalist, International Science Innovation Fair 2025, Bali",
      "International Scratch Olympiad Runner-Up",
      "Codeavour 7.0 selected",
      "National Dominanation at 30+ National Competitions",
    ],
  },
  {
    index: "F-02",
    name: "Samin Yeasar",
    role: "Co-Founder",
    achievements: [
      "Co-Founded MentorMind",
      
      "Top 10 placer, International Academic Research Competition",
      "Bronze Medalist, international Computer Science Competition",
      "Multiple international online hackathon finalist",
      "Codeavour 7.0 selected",
      "International English Olympiad finalist",
      "7th place, Team Fälschen, The Reply AI Agent Competition, out of 3,143 teams",
      "National Dominanation at 30+ National Competitions",
    ],
  },
];

/* ─────────────────────────────────────────────────────────
 * RevealSection — wraps any block, fades + slides in on scroll.
 * Pass `stagger={true}` to also stagger direct child elements.
 * ───────────────────────────────────────────────────────── */
function RevealSection({
  children,
  className = "",
  stagger = false,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: delay } },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
      transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Single child item that animates within a stagger parent */
function RevealItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 48 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.23, 1, 0.32, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionKicker({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return (
    <div className="section-kicker">
      <span className="kicker-number">{number}</span>
      <span className="kicker-eyebrow">{eyebrow}</span>
      <h2>
        <ScrollRevealText text={title} as="span" trigger="scroll" />
      </h2>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * 3D Rolling digit — circular/drum-roll animation on scroll
 * Inspired by "3D Rolling Text on scroll" (perspective drum effect)
 * ───────────────────────────────────────────────────────── */
function RollingDigit({ value }: { value: string }) {
  // Generate an array of digits 00-99 to roll through
  const digits = Array.from({ length: 10 }, (_, i) => String(i));
  const currentIndex = parseInt(value, 10);

  return (
    <div
      className="rolling-digit-wrap"
      style={{
        display: "inline-block",
        overflow: "hidden",
        height: "1.05em",
        position: "relative",
        verticalAlign: "top",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "-100%", rotateX: -90, opacity: 0 }}
          animate={{ y: "0%", rotateX: 0, opacity: 1 }}
          exit={{ y: "100%", rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
          style={{
            display: "block",
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* Full rolling number — splits digits and rolls each separately */
function RollingNumber({ value }: { value: string }) {
  return (
    <span style={{ display: "inline-flex" }}>
      {value.split("").map((digit, i) => (
        <RollingDigit key={i} value={digit} />
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
 * Scroll-driven 3D rolling text for the countdown numbers.
 * The whole countdown block sits inside a tall scroll container;
 * each digit rolls as the block scrolls in.
 * ───────────────────────────────────────────────────────── */
function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  // Scroll-driven parallax for the entire timer block
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const timerY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const timerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const diff = Math.max(0, COUNTDOWN_TARGET - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      className="countdown-section section-pad"
      id="countdown"
      aria-labelledby="countdown-title"
    >
      <div className="container">
        <motion.div
          className="countdown-inner"
          style={{ y: timerY, opacity: timerOpacity }}
        >
          <p className="eyebrow mono countdown-eyebrow">NEXT STOP / AUGUST 29</p>

          <h2
            className="countdown-title"
            id="countdown-title"
            style={{ perspective: "600px" }}
          >
            <ScrollRevealText
              text="VISIT US AT OUR"
              as="span"
              trigger="scroll"
              className="block"
            />
            <ScrollRevealText
              text="NEXT STOP"
              as="span"
              trigger="scroll"
              className="block"
            />
          </h2>

          <div className="countdown-location mono">
            <span className="countdown-pin">//</span>
            Lalbhagh Fort, Dhaka-1205, Bangladesh
          </div>
          <p className="countdown-subtitle">PRESENTING LIFESPHERE</p>

          {/* 3D Rolling timer */}
          <div
            className="countdown-timer mono"
            style={{ perspective: "800px" }}
          >
            <div className="countdown-block">
              <span className="countdown-num">
                <RollingNumber value={pad(timeLeft.days)} />
              </span>
              <span className="countdown-label">DAYS</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-block">
              <span className="countdown-num">
                <RollingNumber value={pad(timeLeft.hours)} />
              </span>
              <span className="countdown-label">HRS</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-block">
              <span className="countdown-num">
                <RollingNumber value={pad(timeLeft.minutes)} />
              </span>
              <span className="countdown-label">MIN</span>
            </div>
            <span className="countdown-sep">:</span>
            <div className="countdown-block">
              <span className="countdown-num">
                <RollingNumber value={pad(timeLeft.seconds)} />
              </span>
              <span className="countdown-label">SEC</span>
            </div>
          </div>

          <a
            href="#contact"
            className="sharp-button sharp-button-dark countdown-cta"
          >
            Get in touch <IconArrowUpRight size={17} strokeWidth={2.5} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactState, setContactState] = useState<"idle" | "error" | "success">("idle");

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
    <ReactLenis root options={{ lerp: 0.09, duration: 1.2 }}>
      <div className="site-shell">
        {isLoading && (
          <StaircaseLoader
            backgroundColor="#0f1b2d"
            onDone={() => setIsLoading(false)}
            logo={
              <div className="loader-lockup">
                <img
                  src="/assets/white-version.png"
                  alt="Team Fälschen"
                  className="loader-lockup-img"
                />
              </div>
            }
          />
        )}
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <NavbarDemo menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main id="main-content">
        {/* ── Hero ── */}
        <section
          className="hero-section"
          id="top"
          aria-labelledby="hero-title"
        >
          <div
            className="hero-art"
            aria-hidden="true"
            style={{ backgroundImage: `url(${heroArt})` }}
          />
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-meta mono">
              <span>TF / 001</span>
              <span>BIIN SHOWCASE / 2025</span>
            </div>
            <div className="hero-copy">
              {/* Mark — first to appear after loader */}
              <motion.div
                className="hero-mark-wrap"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={!isLoading ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
              >
                <img
                  src={logoUrl}
                  alt="Team Fälschen anvil and hammer mark"
                  className="hero-mark"
                />
              </motion.div>

              {/* Eyebrow */}
              <motion.p
                className="eyebrow mono"
                initial={{ opacity: 0, y: 16 }}
                animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.18 }}
              >
                Two researcher-engineers / robotics · physics · AI
              </motion.p>

              {/* h1 — each line slides up, char stagger fires after the line appears */}
              <h1 id="hero-title">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 24 }}
                  animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.32 }}
                >
                  <ScrollRevealText
                    text="FORGED."
                    as="span"
                    className="h1-solid"
                    charClassName="mono"
                    trigger="mount"
                    delay={420}
                    hold={isLoading}
                  />
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 24 }}
                  animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.46 }}
                >
                  <ScrollRevealText
                    text="WIRED."
                    as="span"
                    className=""
                    charClassName="mono"
                    trigger="mount"
                    delay={560}
                    hold={isLoading}
                  />
                </motion.span>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 24 }}
                  animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.60 }}
                >
                  <ScrollRevealText
                    text="PERFECTED."
                    as="span"
                    className="h1-solid"
                    charClassName="mono"
                    trigger="mount"
                    delay={700}
                    hold={isLoading}
                  />
                </motion.span>
              </h1>

              {/* Positioning text */}
              <motion.p
                className="hero-positioning"
                initial={{ opacity: 0, y: 18 }}
                animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1], delay: 0.78 }}
              >
                A two-person research team building systems that connect the
                physical world, human signals, and intelligent machines.
              </motion.p>

              {/* Actions */}
              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 16 }}
                animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.92 }}
              >
                <a
                  href="#lifesphere"
                  className="sharp-button sharp-button-dark"
                >
                  Trace the build{" "}
                  <IconArrowUpRight size={17} strokeWidth={2.5} />
                </a>
                <a href="#research" className="text-link mono">
                  Read the research <span>↘</span>
                </a>
              </motion.div>
            </div>

            {/* Readout panel */}
            <motion.div
              className="hero-readout mono"
              aria-label="Project readout"
              initial={{ opacity: 0, x: 24 }}
              animate={!isLoading ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 1.0 }}
            >
              <span className="readout-line">
                <i /> SIGNAL ONLINE
              </span>
              <span>LAT 23.8103° N</span>
              <span>LON 90.4125° E</span>
              <span>BUILD / 2025—26</span>
            </motion.div>
          </div>
        </section>

          {/* ── LifeSphere (has its own Skiper31 internal animations) ── */}
          <LifeSphereSection />

          {/* ── Research ── */}
          <RevealSection>
            <section
              className="research-section section-pad"
              id="research"
              aria-labelledby="research-title"
            >
              <div
                className="research-art"
                aria-hidden="true"
                style={{ backgroundImage: `url(${researchArt})` }}
              />
              <div className="container">
                <SectionKicker
                  number="02"
                  eyebrow="RESEARCH LOG / CONTINUOUS"
                  title="Entropia → Convergō"
                />
                <RevealSection stagger className="research-grid">
                  <RevealItem>
                    <article className="research-card research-card-past">
                      <div className="card-index mono">R-01 / PAST PROJECT</div>
                      <h3>Entropia</h3>
                      <p>
                        Quantum mechanics research exploring single-particle
                        manipulation and control.
                      </p>
                      <div className="card-foot mono">
                        <span>PHASE / COMPLETE</span>
                        <span>↗ ARCHIVE</span>
                      </div>
                    </article>
                  </RevealItem>
                  <RevealItem>
                    <div className="research-arrow mono" aria-hidden="true">
                      →
                    </div>
                  </RevealItem>
                  <RevealItem>
                    <article className="research-card research-card-current">
                      <div className="card-index mono accent-text">
                        R-02 / CURRENT PROJECT
                      </div>
                      <h3>Convergō</h3>
                      <p>
                        Mach-Zehnder interferometer research studying
                        visibility invariance under large phase accumulation,
                        targeting ISEF.
                      </p>
                      <div className="card-foot mono">
                        <span>PHASE / ACTIVE</span>
                        <span className="accent-text">● SIGNAL</span>
                      </div>
                    </article>
                  </RevealItem>
                </RevealSection>
                <RevealSection delay={0.2}>
                  <p className="peer-note mono">
                    PEER REVIEWER CREDIT / ABDUS SAMI AKANDA / RESEARCH PEER
                    REVIEWER
                  </p>
                </RevealSection>
              </div>
            </section>
          </RevealSection>

          {/* ── Team ── */}
          <RevealSection>
            <section
              className="team-section section-pad"
              id="team"
              aria-labelledby="team-title"
            >
              <div
                className="team-art"
                aria-hidden="true"
                style={{ backgroundImage: `url(${teamArt})` }}
              />
              <div className="container team-content">
                <SectionKicker
                  number="03"
                  eyebrow="TEAM / TWO OPERATORS"
                  title="Built together"
                />
                <div className="team-heading-row">
                  <p className="lede">
                    <ScrollRevealText
                      text="Two researcher-engineers who have built and competed together across robotics, physics, and AI for years."
                      as="span"
                      trigger="scroll"
                    />
                  </p>
                  <span className="mono team-coord">
                    TEAM / 02
                    <br />
                    STATUS / ALIGNED
                  </span>
                </div>
                <RevealSection stagger className="founder-grid the_damn_team_Card">
                  {founderProfiles.map((founder) => (
                    <RevealItem key={founder.name} className="the_damn_team_Card">
                      <article className="founder-sheet">
                        <div className="sheet-head mono">
                          <span>{founder.index}</span>
                          <span>PROFILE / SPEC</span>
                        </div>
                        <h3>{founder.name}</h3>
                        <p className="founder-role mono">{founder.role}</p>
                        <div className="sheet-rule" />
                        <ul>
                          {founder.achievements.map((achievement) => (
                            <li key={achievement}>{achievement}</li>
                          ))}
                        </ul>
                      </article>
                    </RevealItem>
                  ))}
                </RevealSection>
              </div>
            </section>
          </RevealSection>

          {/* ── Contact ── */}
          <RevealSection>
            <section
              className="contact-section section-pad"
              id="contact"
              aria-labelledby="contact-title"
            >
              <div className="container contact-grid">
                <RevealSection delay={0.05}>
                  <SectionKicker
                    number="04"
                    eyebrow="OPEN CHANNEL / CONTACT"
                    title="Talk to the team"
                  />
                  <p className="body-copy contact-copy">
                    For judges, collaborators, and technical questions, send a
                    short note. We read every message as part of the build.
                  </p>
                </RevealSection>
                <RevealSection delay={0.15}>
                  <form
                    className="contact-form"
                    onSubmit={submitContact}
                    noValidate
                  >
                    <label className="mono" htmlFor="email">
                      YOUR EMAIL
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@domain.com"
                    />
                    <label className="mono" htmlFor="message">
                      YOUR MESSAGE
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      minLength={12}
                      placeholder="What should we build or discuss?"
                      rows={5}
                    />
                    <button
                      className="sharp-button sharp-button-dark"
                      type="submit"
                    >
                      Transmit note <IconArrowUpRight size={17} />
                    </button>
                    {contactState === "error" && (
                      <p className="form-status form-error" role="alert">
                        Check your email and write at least 12 characters.
                      </p>
                    )}
                    {contactState === "success" && (
                      <p className="form-status form-success" role="status">
                        Message captured. Thank you for reaching out to Team
                        Fälschen.
                      </p>
                    )}
                  </form>
                </RevealSection>
              </div>
            </section>
          </RevealSection>

          {/* ── Countdown (3D rolling timer) ── */}
          <CountdownSection />
        </main>

        <SiteFooter />
      </div>
    </ReactLenis>
  );
}

export default Home;
