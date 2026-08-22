/* ScrollRevealText — two modes delivered as separate components to avoid
 * conditional-hook bugs.
 *
 * <RevealOnScroll>  — characters appear left-to-right as the element scrolls
 *                     into the viewport (IntersectionObserver + rAF).
 * <RevealOnMount>   — characters appear with a stagger on mount (hero title).
 *
 * Both are fully accessible: screen readers always see the full text.
 */
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────────────
 * Shared: individual character wrapper
 * ────────────────────────────────────────────────────────────────────── */
function Char({
  char,
  revealed,
  charClassName,
}: {
  char: string;
  revealed: boolean;
  charClassName?: string;
}) {
  if (char === " ") {
    return (
      <span
        className={charClassName}
        style={{ display: "inline-block", whiteSpace: "pre" }}
        aria-hidden="true"
      >
        &nbsp;
      </span>
    );
  }

  return (
    <span
      className={charClassName}
      style={{
        display: "inline-block",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.4s cubic-bezier(0.23,1,0.32,1), transform 0.4s cubic-bezier(0.23,1,0.32,1)",
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      {char}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * RevealOnScroll — characters reveal as the element scrolls into view
 * ────────────────────────────────────────────────────────────────────── */
interface RevealOnScrollProps {
  text: string;
  as?: ElementType;
  className?: string;
  charClassName?: string;
  /** How many ms between each character appearing (default 40) */
  stagger?: number;
  /** Percentage of element that must be visible before reveal starts (0-1, default 0.15) */
  threshold?: number;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export function RevealOnScroll({
  text,
  as: Tag = "span",
  className = "",
  charClassName = "",
  stagger = 40,
  threshold = 0.15,
  style,
}: RevealOnScrollProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const chars = text.split("");
  const total = chars.length;
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !cancelled) {
          observer.disconnect();
          // Stagger characters one by one
          for (let i = 0; i < total; i++) {
            const id = window.setTimeout(() => {
              if (!cancelled) setRevealedCount(i + 1);
            }, i * stagger);
            timersRef.current.push(id);
          }
        }
      },
      { threshold },
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
    };
  }, [total, stagger, threshold]);

  return (
    <Tag ref={wrapperRef as never} className={className} style={style} aria-label={text}>
      <span aria-hidden="true">
        {chars.map((char, i) => (
          <Char key={`${i}`} char={char} revealed={i < revealedCount} charClassName={charClassName} />
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * RevealOnMount — characters appear with a stagger after mount
 * ────────────────────────────────────────────────────────────────────── */
interface RevealOnMountProps {
  text: string;
  as?: ElementType;
  className?: string;
  charClassName?: string;
  /** Delay in ms before the first character appears (default 800) */
  delay?: number;
  /** Ms between each character (default 35) */
  stagger?: number;
  children?: ReactNode;
  style?: React.CSSProperties;
  /** When true, hold all timers until this becomes false */
  hold?: boolean;
}

export function RevealOnMount({
  text,
  as: Tag = "span",
  className = "",
  charClassName = "",
  delay = 800,
  stagger = 35,
  style,
  hold = false,
}: RevealOnMountProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const chars = text.split("");
  const total = chars.length;

  useEffect(() => {
    // Don't start until hold is released
    if (hold) return;

    const timers: number[] = [];
    for (let i = 0; i < total; i++) {
      const id = window.setTimeout(() => setRevealedCount(i + 1), delay + i * stagger);
      timers.push(id);
    }
    return () => timers.forEach(window.clearTimeout);
  }, [hold, total, delay, stagger]);

  return (
    <Tag className={className} style={style} aria-label={text}>
      <span aria-hidden="true">
        {chars.map((char, i) => (
          <Char key={`${i}`} char={char} revealed={i < revealedCount} charClassName={charClassName} />
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * ScrollRevealText — unified wrapper that picks the right mode via `trigger`
 * Usage:
 *   <ScrollRevealText text="Hello" trigger="scroll" />
 *   <ScrollRevealText text="Hello" trigger="mount" delay={800} />
 * ────────────────────────────────────────────────────────────────────── */
interface ScrollRevealTextProps extends RevealOnScrollProps, RevealOnMountProps {
  trigger: "scroll" | "mount";
}

export function ScrollRevealText({
  trigger,
  text,
  as,
  className,
  charClassName,
  stagger,
  threshold,
  delay,
  style,
  hold,
}: ScrollRevealTextProps) {
  if (trigger === "mount") {
    return (
      <RevealOnMount
        text={text}
        as={as}
        className={className}
        charClassName={charClassName}
        stagger={stagger}
        delay={delay}
        style={style}
        hold={hold}
      />
    );
  }
  return (
    <RevealOnScroll
      text={text}
      as={as}
      className={className}
      charClassName={charClassName}
      stagger={stagger}
      threshold={threshold}
      style={style}
    />
  );
}
