/* LifeSphere section — Skiper31 (ScrollAnimation_002) style.
 *
 * Layout:
 *   1. Section heading + intro copy → standard in-view reveal
 *   2. Cards row → Skiper31 CharacterV1 style: each card starts spread
 *      outward from center on scroll, converging to normal position
 *      as scrollYProgress approaches 0.5.
 *   3. Tech stack + recognition → plain in-view reveals
 *   4. CTA buttons → in-view reveal
 *
 * The "Skiper" effect is applied to the subsystem cards:
 *   • Horizontal spread (x) proportional to distance from center
 *   • 3D rotateX from distance-from-center, flattening to 0
 *   • Scale from 0.85 → 1 as you scroll in
 *
 * All palette / styling unchanged from original LifeSphereSection.tsx.
 */
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import { Glossary } from "@/components/Glossary";
import { InfiniteMovingCards, LogoLoop, SectionHeading } from "@/components/Marquee";
import { ScrollRevealText } from "@/components/ScrollRevealText";
import { IconArrowUpRight } from "@tabler/icons-react";
import {
  AWARDS,
  GLOSSARY,
  LIFESPHERE_SITE_URL,
  PAPER_URL,
  SUBSYSTEMS,
  TECH_STACK,
} from "@/data/lifesphere";

const asciiMark = "/assets/ascii.png";

/* ─────────────────────────────────────────────────────────
 * Skiper31-style animated card
 * index         = 0-based position in the array
 * centerIndex   = Math.floor(total / 2)
 * scrollYProgress = from the section-level useScroll
 * ───────────────────────────────────────────────────────── */
function SkiperCard({
  index,
  centerIndex,
  scrollYProgress,
  children,
  className = "",
}: {
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
}) {
  const distanceFromCenter = index - centerIndex;

  // Spread: cards start offset proportional to distance, converge to 0
  const x = useTransform(
    scrollYProgress,
    [0, 0.55],
    [distanceFromCenter * 80, 0],
  );

  // 3D tilt: each card tilts on X-axis, straightens as it arrives
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.55],
    [distanceFromCenter * 18, 0],
  );

  // Scale up from slightly small
  const scale = useTransform(scrollYProgress, [0, 0.55], [0.86, 1]);

  // Fade in
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <motion.article
      className={`ls-card panel-flat ${className}`}
      style={{ x, rotateX, scale, opacity, transformOrigin: "center" }}
    >
      {children}
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────
 * Simple in-view fade-up for non-card elements
 * ───────────────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
 * Main export
 * ───────────────────────────────────────────────────────── */
export default function LifeSphereSection() {
  /* The cards-block is the scroll target — it needs enough height so the
   * user scrolls through the Skiper animation before the next section. */
  const cardsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ["start end", "center center"],
  });

  const centerIndex = Math.floor(SUBSYSTEMS.length / 2);

  return (
    <section
      className="lifesphere-section section-pad"
      id="lifesphere"
      aria-labelledby="lifesphere-title"
    >
      <div className="lifesphere-grid-bg" aria-hidden="true" />
      <div className="container">
        {/* ── Section heading ── */}
        <FadeUp>
          <SectionHeading
            index="SEC 01"
            kicker="THE SPOTLIGHT OF THIS YEAR"
            title="LIFESPHERE"
            id="lifesphere-title"
            highlight
          />
        </FadeUp>

        {/* ── 1. Introduction grid ── */}
        <FadeUp delay={0.08} className="ls-intro">
          <div className="ls-intro-copy">
            <p className="lede">
              <ScrollRevealText
                text="Five subsystems. One ecosystem."
                as="span"
                trigger="scroll"
              />
            </p>
            <p className="body-copy">
              LifeSphere is an AI-powered autonomous caregiving ecosystem
              designed to sense, interpret, and respond. The system links
              wearable telemetry, robotics, emotion intelligence, home
              security, and automation into one accountable loop.
            </p>
            <p className="body-copy ls-recog">
              Recognized with eleven national and international awards,
              including Gold at the International Science Innovation Fair 2025
              in Bali and was awarded Gold Medal and Specially Awarded at the 7th World Invention Competition and Exhibition 2025.
            </p>
          </div>
          <aside className="ls-raster panel-flat">
            <div className="ls-raster-head mono">
              <span>LIFESPHERE MARK / READOUT</span>
            </div>
            <div className="ls-raster-art" aria-hidden="true">
              <img
                src={asciiMark}
                alt="LifeSphere logo"
                className="w-full max-h-[200px] object-contain"
              />
            </div>
            <div className="ls-raster-foot mono">
              <span>RES / ASCII</span>
              <span className="accent-text">● SIGNAL</span>
            </div>
          </aside>
        </FadeUp>

        {/* ── 2. Subsystem cards — Skiper31 animation ── */}
        {/* Outer div with extra padding creates the scroll "room" */}
        <div
          ref={cardsRef}
          className="ls-cards-skiper-wrapper"
          style={{ perspective: "900px" }}
        >
          <div className="ls-cards">
            {SUBSYSTEMS.map((sys, i) => (
              <SkiperCard
                key={sys.id}
                index={i}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
                className={i === 0 ? "ls-card-featured" : ""}
              >
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
                      <Glossary
                        key={term}
                        term={term}
                        definition={GLOSSARY[term] ?? ""}
                      />
                    ))}
                  </div>
                )}
              </SkiperCard>
            ))}
          </div>
        </div>

        {/* ── 3. Tech stack carousel ── */}
        <FadeUp delay={0.05} className="ls-stack">
          <span className="ls-stack-label mono">TECH STACK / LOOP</span>
          <LogoLoop items={TECH_STACK} duration={38} />
        </FadeUp>

        {/* ── 4. Recognition carousel ── */}
        <FadeUp delay={0.1} className="ls-recognition">
          <span className="ls-recognition-label mono">
            RECOGNITION / 11 AWARDS
          </span>
          <InfiniteMovingCards items={AWARDS} duration={48} />
        </FadeUp>

        {/* ── 5. CTA buttons ── */}
        <FadeUp delay={0.05} className="ls-cta">
          <a href={PAPER_URL} className="sharp-button sharp-button-dark">
            Visit the research paper{" "}
            <IconArrowUpRight size={17} strokeWidth={2.5} />
          </a>
          <a
            href={LIFESPHERE_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sharp-button"
          >
            Visit the LifeSphere site{" "}
            <IconArrowUpRight size={17} strokeWidth={2.5} />
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
