/* Signal Forge marquee primitives: zero-radius, 3px borders, phosphor hover, infinite seamless loop.
 * LogoLoop        — single-row strip of labelled badges scrolling left.
 * InfiniteMovingCards — row of panel-flat cards scrolling left, pauses on hover.
 * Both duplicate their children once and translate -50% over a configurable duration,
 * gated by prefers-reduced-motion (which the global sheet collapses to ~0ms).
 */
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Marquee({
  children,
  duration = 40,
  className,
  reverse = false,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  reverse?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={cn("marquee", className)}>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${reduced ? 0.01 : duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: reduced ? "paused" : "running",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

export function LogoLoop({ items, duration }: { items: string[]; duration?: number }) {
  return (
    <Marquee duration={duration} className="logo-loop">
      {items.map((label) => (
        <span className="logo-badge mono" key={label}>
          {label}
        </span>
      ))}
    </Marquee>
  );
}

export function InfiniteMovingCards({
  items,
  duration,
}: {
  items: { id: string; index: string; title: string; venue: string }[];
  duration?: number;
}) {
  return (
    <Marquee duration={duration} className="awards-loop">
      {items.map((award) => (
        <article className="award-card panel-flat" key={award.id}>
          <span className="award-index mono">{award.index}</span>
          <h4 className="award-title mono">{award.title}</h4>
          <span className="award-venue mono">{award.venue}</span>
        </article>
      ))}
    </Marquee>
  );
}

/** Section heading: index + kicker + title, reusable across the page. */
export function SectionHeading({
  index,
  kicker,
  title,
  id,
}: {
  index: string;
  kicker: string;
  title: string;
  id?: string;
}) {
  return (
    <header className="section-heading" {...(id ? { id } : {})}>
      <span className="heading-index mono">{index}</span>
      <span className="heading-kicker mono">{kicker}</span>
      <h2 className="heading-title">{title}</h2>
    </header>
  );
}

/** Pauses the marquee when hovered/focused anywhere inside. */
export function useMarqueeHoverPause() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => setPaused(true);
    const leave = () => setPaused(false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("focusin", enter);
    el.addEventListener("focusout", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("focusout", leave);
    };
  }, []);
  return { ref, paused };
}
