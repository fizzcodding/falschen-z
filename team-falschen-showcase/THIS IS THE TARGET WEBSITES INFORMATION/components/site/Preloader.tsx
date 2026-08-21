import { useEffect, useRef, useState } from "react";
import lockup from "@/assets/falschen-lockup.png.asset.json";

const COLUMNS = 14;

/**
 * Double staircase preloader: steps drive in from the top and the bottom of the
 * viewport at the same time, staggered across the grid, then retract to reveal
 * the page. No spinner, no progress bar, no text: just the light lockup.
 */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const release = () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };

    const out = window.setTimeout(() => setPhase("out"), 1200);
    const reveal = window.setTimeout(() => {
      release();
      doneRef.current?.();
    }, 1500);
    const done = window.setTimeout(() => setPhase("done"), 2200);

    return () => {
      window.clearTimeout(out);
      window.clearTimeout(done);
      window.clearTimeout(reveal);
      release();
    };
  }, []);

  if (phase === "done") return null;

  const cols = Array.from({ length: COLUMNS });

  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <div className="absolute inset-0 flex">
        {cols.map((_, i) => (
          <div key={`t-${i}`} className="relative h-full flex-1">
            <div
              className="absolute inset-x-0 top-0 h-1/2"
              style={{
                backgroundColor: "#0f1b2d",
                transformOrigin: "top",
                animation: `${phase === "in" ? "stair-in" : "stair-out"} 620ms cubic-bezier(0.76,0,0.24,1) both`,
                animationDelay: `${(phase === "in" ? i : COLUMNS - 1 - i) * 38}ms`,
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{
                backgroundColor: "#0f1b2d",
                transformOrigin: "bottom",
                animation: `${phase === "in" ? "stair-in" : "stair-out"} 620ms cubic-bezier(0.76,0,0.24,1) both`,
                animationDelay: `${(phase === "in" ? COLUMNS - 1 - i : i) * 38}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={lockup.url}
          alt=""
          className="w-[min(58vw,420px)] brightness-0 invert"
          style={{
            animation: `${phase === "in" ? "mark-in" : "mark-out"} 600ms ease-out both`,
            animationDelay: phase === "in" ? "520ms" : "0ms",
          }}
        />
      </div>
    </div>
  );
}
