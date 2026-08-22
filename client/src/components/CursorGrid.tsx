/* CursorGrid — canvas-based interactive grid that illuminates cells near the cursor.
 * Adaptive color: samples the background color under the cursor via elementFromPoint,
 * then inverts it so the grid is always visible regardless of section background.
 * Z-index: 1 — sits behind all page content (containers at z-index:2+).
 */
import { useEffect, useRef, useCallback } from "react";

interface CursorGridProps {
  cellSize?: number;
  radius?: number;
  falloff?: "smooth" | "linear" | "sharp";
  holdTime?: number;
  fadeDuration?: number;
  lineWidth?: number;
  maxOpacity?: number;
  fillOpacity?: number;
  gridOpacity?: number;
  cellRadius?: number;
  clickPulse?: boolean;
  pulseSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
  // color prop kept for API compatibility but overridden by adaptive sampling
  color?: string;
}

interface PulseRing {
  x: number;
  y: number;
  startedAt: number;
  duration: number;
}

/* ── Sample the computed background color at a screen point ── */
function sampleBgColorAt(x: number, y: number): [number, number, number] {
  // Temporarily hide the canvas so it doesn't interfere with hit-testing
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  if (!el) return [16, 26, 46]; // fallback: navy

  // Walk up the DOM until we find an element with a non-transparent background
  let node: HTMLElement | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const m = bg.match(/[\d.]+/g);
      if (m && m.length >= 3) {
        return [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])];
      }
    }
    node = node.parentElement;
  }
  return [246, 246, 246]; // fallback: paper
}

/* ── Invert an RGB color ── */
function invertRgb(r: number, g: number, b: number): [number, number, number] {
  return [255 - r, 255 - g, 255 - b];
}

export default function CursorGrid({
  cellSize = 70,
  radius = 140,
  falloff = "smooth",
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 1.2,
  maxOpacity = 1,
  fillOpacity = 0,
  gridOpacity = 0,
  cellRadius = 0,
  clickPulse = false,
  pulseSpeed = 600,
  className,
  style,
}: CursorGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const cursorRef = useRef<{ x: number; y: number; lastMove: number }>({
    x: -9999,
    y: -9999,
    lastMove: 0,
  });
  const pulsesRef = useRef<PulseRing[]>([]);
  // Adaptive color — updated on pointer move, sampled at canvas position
  const adaptiveRgbRef = useRef<[number, number, number]>([16, 26, 46]);

  const roundRect = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      if (r <= 0) { ctx.rect(x, y, w, h); return; }
      const rad = Math.min(r, w / 2, h / 2);
      ctx.moveTo(x + rad, y);
      ctx.lineTo(x + w - rad, y);
      ctx.arcTo(x + w, y, x + w, y + rad, rad);
      ctx.lineTo(x + w, y + h - rad);
      ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad);
      ctx.lineTo(x + rad, y + h);
      ctx.arcTo(x, y + h, x, y + h - rad, rad);
      ctx.lineTo(x, y + rad);
      ctx.arcTo(x, y, x + rad, y, rad);
      ctx.closePath();
    },
    [],
  );

  const computeFalloff = useCallback(
    (dist: number): number => {
      const t = Math.max(0, 1 - dist / radius);
      if (falloff === "linear") return t;
      if (falloff === "sharp") return t > 0 ? 1 : 0;
      return 0.5 - 0.5 * Math.cos(t * Math.PI); // smooth cosine
    },
    [radius, falloff],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const now = performance.now();
    const { x: cx, y: cy, lastMove } = cursorRef.current;
    const elapsed = now - lastMove;

    let fade = 1;
    if (elapsed > holdTime) {
      fade = Math.max(0, 1 - (elapsed - holdTime) / fadeDuration);
    }

    const cols = Math.ceil(W / cellSize) + 1;
    const rows = Math.ceil(H / cellSize) + 1;
    const [r, g, b] = adaptiveRgbRef.current;

    // Clean up expired pulses
    pulsesRef.current = pulsesRef.current.filter(
      (p) => now - p.startedAt < p.duration + fadeDuration,
    );

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellX = col * cellSize;
        const cellY = row * cellSize;
        const cellCX = cellX + cellSize / 2;
        const cellCY = cellY + cellSize / 2;

        const dist = Math.hypot(cellCX - cx, cellCY - cy);
        let intensity = computeFalloff(dist) * fade;

        for (const pulse of pulsesRef.current) {
          const pd = Math.hypot(cellCX - pulse.x, cellCY - pulse.y);
          const progress = (now - pulse.startedAt) / pulse.duration;
          const pulseRadius = progress * (radius * 2.2);
          const ringWidth = radius * 0.55;
          const pDist = Math.abs(pd - pulseRadius);
          if (pDist < ringWidth) {
            const pFade = Math.max(
              0,
              1 - (now - pulse.startedAt) / (pulse.duration + fadeDuration * 0.5),
            );
            intensity = Math.max(intensity, (1 - pDist / ringWidth) * pFade);
          }
        }

        if (intensity <= 0.005 && gridOpacity <= 0) continue;

        const strokeAlpha = gridOpacity + intensity * (maxOpacity - gridOpacity);

        ctx.beginPath();
        roundRect(ctx, cellX + 0.5, cellY + 0.5, cellSize - 1, cellSize - 1, cellRadius);

        if (fillOpacity > 0 && intensity > 0.005) {
          ctx.fillStyle = `rgba(${r},${g},${b},${intensity * fillOpacity})`;
          ctx.fill();
        }

        if (strokeAlpha > 0.005) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${strokeAlpha})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }
    }
  }, [cellSize, computeFalloff, fillOpacity, gridOpacity, lineWidth, maxOpacity, cellRadius, roundRect, holdTime, fadeDuration, radius]);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Throttle color sampling — not every frame, only on move
    let lastSample = 0;

    const onMove = (e: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      cursorRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        lastMove: performance.now(),
      };

      // Sample adaptive color every 80ms max
      const now = performance.now();
      if (now - lastSample > 80) {
        lastSample = now;
        // Temporarily set canvas pointer-events to none (it already is) so
        // elementFromPoint hits the element below
        const bg = sampleBgColorAt(e.clientX, e.clientY);
        adaptiveRgbRef.current = invertRgb(...bg);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!clickPulse) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pulsesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        startedAt: performance.now(),
        duration: pulseSpeed,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [clickPulse, pulseSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,          // behind all page content (containers z-index:2+)
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
