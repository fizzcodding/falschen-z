/* ClickSpark — canvas-based click-triggered spark burst.
 * On each click a burst of sparkCount lines radiates outward and fades.
 * Rendered on a fixed full-screen singleton canvas, pointer-events: none.
 *
 * Can be used in two ways:
 *   1. Standalone (no children): attaches to window, global effect.
 *   2. Wrapper: wraps children, sparks fire on click within the wrapper.
 *
 * Props:
 *   sparkColor  — color of sparks (default "#fff")
 *   sparkSize   — length of each spark line in px (default 10)
 *   sparkRadius — distance sparks travel from click point (default 15)
 *   sparkCount  — sparks per burst (default 8)
 *   duration    — ms until fully faded (default 400)
 */
import { useEffect, useRef, useCallback } from "react";

interface Burst {
  x: number;
  y: number;
  startedAt: number;
  duration: number;
  count: number;
  size: number;
  travelRadius: number;
  color: string;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Singleton canvas ── */
let _canvas: HTMLCanvasElement | null = null;
let _ctx: CanvasRenderingContext2D | null = null;
const _bursts: Burst[] = [];
let _raf = 0;

function ensureCanvas() {
  if (_canvas) return;
  _canvas = document.createElement("canvas");
  _canvas.setAttribute("aria-hidden", "true");
  Object.assign(_canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9999",
  });
  document.body.appendChild(_canvas);
  _ctx = _canvas.getContext("2d");

  const resize = () => {
    if (!_canvas) return;
    _canvas.width = window.innerWidth;
    _canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });
}

function renderLoop() {
  if (!_canvas || !_ctx) return;
  _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
  const now = performance.now();

  for (let i = _bursts.length - 1; i >= 0; i--) {
    const b = _bursts[i];
    const elapsed = now - b.startedAt;
    if (elapsed > b.duration) {
      _bursts.splice(i, 1);
      continue;
    }

    const progress = elapsed / b.duration;
    const eased = 1 - Math.pow(1 - progress, 2.5); // ease-out
    const opacity = 1 - progress;
    const dist = eased * b.travelRadius;

    _ctx.save();
    _ctx.globalAlpha = opacity;
    _ctx.strokeStyle = b.color;
    _ctx.lineWidth = 1.6;
    _ctx.lineCap = "round";

    for (let s = 0; s < b.count; s++) {
      const angle = (2 * Math.PI * s) / b.count;
      const innerD = dist * 0.4;
      const x1 = b.x + Math.cos(angle) * innerD;
      const y1 = b.y + Math.sin(angle) * innerD;
      const x2 = b.x + Math.cos(angle) * (innerD + b.size);
      const y2 = b.y + Math.sin(angle) * (innerD + b.size);
      _ctx.beginPath();
      _ctx.moveTo(x1, y1);
      _ctx.lineTo(x2, y2);
      _ctx.stroke();
    }

    _ctx.restore();
  }

  if (_bursts.length > 0) {
    _raf = requestAnimationFrame(renderLoop);
  }
}

function fireBurst(
  x: number,
  y: number,
  { sparkColor, sparkSize, sparkRadius, sparkCount, duration }: Required<Omit<ClickSparkProps, "children" | "className" | "style">>,
) {
  ensureCanvas();
  _bursts.push({
    x,
    y,
    startedAt: performance.now(),
    duration,
    count: sparkCount,
    size: sparkSize,
    travelRadius: sparkRadius,
    color: sparkColor,
  });
  cancelAnimationFrame(_raf);
  _raf = requestAnimationFrame(renderLoop);
}

export default function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  children,
  className,
  style,
}: ClickSparkProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const config = { sparkColor, sparkSize, sparkRadius, sparkCount, duration };

  useEffect(() => {
    ensureCanvas();
  }, []);

  /* Standalone mode: listen on window */
  useEffect(() => {
    if (children !== undefined) return; // wrapper mode handles its own clicks
    const handler = (e: MouseEvent) => fireBurst(e.clientX, e.clientY, config);
    window.addEventListener("click", handler, { passive: true });
    return () => window.removeEventListener("click", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      fireBurst(e.clientX, e.clientY, config);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sparkColor, sparkSize, sparkRadius, sparkCount, duration],
  );

  /* Standalone: render nothing visible */
  if (children === undefined) return null;

  /* Wrapper mode */
  return (
    <div
      ref={wrapperRef}
      onClick={handleClick}
      className={className}
      style={{ position: "relative", ...style }}
    >
      {children}
    </div>
  );
}
