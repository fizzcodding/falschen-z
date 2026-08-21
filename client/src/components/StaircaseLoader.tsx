/* StaircaseLoader: synchronized double-staircase intro animation.
 * 14 vertical columns, each split into top/bottom halves that descend/ascend
 * with a staggered scaleY transform, revealing a centered logo lockup.
 * Phase timeline:
 *   in   (0–620ms)     — stairs descend/ascend, staggered 38ms/column
 *   out  (1200–1500ms) — stairs reverse and retract (stagger direction flips)
 *   done (2200ms+)     — component unmounts via onDone
 * Logo fades in with slight upward motion starting at 520ms.
 * Page scrolling is locked for the full animation duration.
 */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const COLUMNS = 14;

type CubicBezier = [number, number, number, number];
const STAIR_EASE: CubicBezier = [0.76, 0, 0.24, 1];
const LOGO_EASE: CubicBezier = [0.22, 1, 0.36, 1];

export interface StaircaseLoaderProps {
  /** Logo / lockup node shown in the center while stairs are deployed. */
  logo?: React.ReactNode;
  /** Background color of the loader mask. Defaults to the site navy. */
  backgroundColor?: string;
  /** Color of the stair columns. Defaults to the paper field. */
  stairColor?: string;
  /** Called once the full animation has finished and the mask is unmounting. */
  onDone?: () => void;
  /** Total in-phase duration (ms). Stairs are staggered across this window. */
  inDurationMs?: number;
  /** Per-column stagger delay (ms) applied during the in phase. */
  staggerMs?: number;
  /** Timestamp (ms from mount) at which the out phase begins. */
  outStartMs?: number;
  /** Timestamp (ms from mount) at which onDone fires and the mask unmounts. */
  doneMs?: number;
}

type Phase = "in" | "out" | "done";

export default function StaircaseLoader({
  logo,
  backgroundColor = "#0f1b2d",
  stairColor = "#F6F6F6",
  onDone,
  inDurationMs = 620,
  staggerMs = 38,
  outStartMs = 1200,
  doneMs = 2200,
}: StaircaseLoaderProps) {
  const [phase, setPhase] = useState<Phase>("in");

  // Lock scrolling while the loader is on screen.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Drive phase transitions off a single timeline.
  useEffect(() => {
    const outTimer = window.setTimeout(() => setPhase("out"), outStartMs);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      onDone?.();
    }, doneMs);
    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(doneTimer);
    };
  }, [outStartMs, doneMs, onDone]);

  // Stagger direction reverses between in/out for a smooth reveal.
  const order = useMemo(() => {
    const indices = Array.from({ length: COLUMNS }, (_, i) => i);
    return phase === "out" ? [...indices].reverse() : indices;
  }, [phase]);

  const stairDelay = (column: number) => order.indexOf(column) * staggerMs;
  const logoDelay = 520;

  const visible = phase !== "done";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
            gridTemplateRows: "1fr 1fr",
            backgroundColor,
            overflow: "hidden",
          }}
        >
          {/* Top half of each column: descends from the top edge. */}
          {Array.from({ length: COLUMNS }, (_, i) => (
            <motion.div
              key={`top-${i}`}
              style={{ gridColumn: i + 1, gridRow: 1, transformOrigin: "top", backgroundColor: stairColor }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: phase === "in" ? 1 : 0 }}
              transition={{
                duration: inDurationMs / 1000,
                ease: STAIR_EASE,
                delay: stairDelay(i) / 1000,
              }}
            />
          ))}

          {/* Bottom half of each column: ascends from the bottom edge. */}
          {Array.from({ length: COLUMNS }, (_, i) => (
            <motion.div
              key={`bottom-${i}`}
              style={{ gridColumn: i + 1, gridRow: 2, transformOrigin: "bottom", backgroundColor: stairColor }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: phase === "in" ? 1 : 0 }}
              transition={{
                duration: inDurationMs / 1000,
                ease: STAIR_EASE,
                delay: stairDelay(i) / 1000,
              }}
            />
          ))}

          {/* Centered logo / lockup. */}
          {logo && (
            <motion.div
              style={{
                gridColumn: `1 / -1`,
                gridRow: "1 / -1",
                display: "grid",
                placeItems: "center",
                pointerEvents: "none",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: phase === "out" ? 0 : 1,
                y: phase === "out" ? -8 : 0,
              }}
              transition={{
                duration: 0.5,
                ease: LOGO_EASE,
                delay: logoDelay / 1000,
              }}
            >
              {logo}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
