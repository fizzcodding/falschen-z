/* CursorGrid — canvas-based interactive grid that illuminates cells near the cursor.
 * Adaptive color: samples the background color under the cursor via elementFromPoint,
 * then inverts it so the grid is always visible regardless of section background.
 * Steps aside over content: when the cursor is over a card, text, or any other
 * element, the grid fades out so it never overlaps page content.
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

/* ── Classify the point under the cursor ──
 * Returns the background RGB the trail should contrast with, plus whether the
 * cursor is sitting on actual page content (cards, text, buttons, images…).
 * When over content the trail steps aside so it never overlaps anything. */
function classifyAt(
  x: number,
  y: number
): { rgb: [number, number, number]; overContent: boolean } {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  if (!el) return { rgb: [16, 26, 46], overContent: false }; // fallback: navy

  // Walk up the DOM until we find an element with a non-transparent background —
  // that's the color the trail must stay visible against.
  let node: HTMLElement | null = el;
  let rgb: [number, number, number] = [246, 246, 246]; // fallback: paper
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const m = bg.match(/[\d.]+/g);
      if (m && m.length >= 3) {
        rgb = [parseInt(m[0], 10), parseInt(m[1], 10), parseInt(m[2], 10)];
        break;
      }
    }
    node = node.parentElement;
  }

  const overContent =
    isContentElement(el) || (node !== null && isContentElement(node));
  return { rgb, overContent };
}

/* Section-level containers count as "background" — the trail may draw over them.
 * Anything else under the cursor (cards, text, buttons, images, panels…) is
 * content, and the trail must step out of the way. */
function isContentElement(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (["SECTION", "FOOTER", "MAIN", "BODY", "HTML"].includes(tag)) return false;

  // Text, interactive, and media elements are always content.
  if (
    [
      "A",
      "BUTTON",
      "INPUT",
      "TEXTAREA",
      "SELECT",
      "OPTION",
      "LABEL",
      "FORM",
      "NAV",
      "DIALOG",
      "IFRAME",
      "IMG",
      "PICTURE",
      "VIDEO",
      "CANVAS",
      "SVG",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "P",
      "SPAN",
      "LI",
      "UL",
      "OL",
      "STRONG",
      "EM",
      "BLOCKQUOTE",
      "CODE",
      "PRE",
      "SMALL",
      "I",
      "B",
      "FIGURE",
      "FIGCAPTION",
      "ARTICLE",
      "ASIDE",
      "TABLE",
      "TR",
      "TD",
      "TH",
    ].includes(tag)
  ) {
    return true;
  }

  // A card/panel: has its own background, border, or shadow.
  const cs = getComputedStyle(el);
  if (
    cs.backgroundColor !== "rgba(0, 0, 0, 0)" &&
    cs.backgroundColor !== "transparent"
  )
    return true;
  if (
    cs.borderTopWidth !== "0px" ||
    cs.borderRightWidth !== "0px" ||
    cs.borderBottomWidth !== "0px" ||
    cs.borderLeftWidth !== "0px"
  ) {
    return true;
  }
  if (cs.boxShadow !== "none") return true;

  return false;
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
  // Whether the cursor currently sits on page content (cards, text, …)
  const overContentRef = useRef(false);
  // Smoothed 0..1 fade used to step aside over content
  const contentFadeRef = useRef(1);

  const roundRect = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      if (r <= 0) {
        ctx.rect(x, y, w, h);
        return;
      }
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
    []
  );

  const computeFalloff = useCallback(
    (dist: number): number => {
      const t = Math.max(0, 1 - dist / radius);
      if (falloff === "linear") return t;
      if (falloff === "sharp") return t > 0 ? 1 : 0;
      return 0.5 - 0.5 * Math.cos(t * Math.PI); // smooth cosine
    },
    [radius, falloff]
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

    // Smoothly step aside when the cursor is over page content so the trail
    // never draws on top of cards, text, or any other element.
    const targetFade = overContentRef.current ? 0 : 1;
    contentFadeRef.current += (targetFade - contentFadeRef.current) * 0.18;
    fade *= contentFadeRef.current;

    if (fade <= 0.005) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    const cols = Math.ceil(W / cellSize) + 1;
    const rows = Math.ceil(H / cellSize) + 1;
    const [r, g, b] = adaptiveRgbRef.current;

    // Clean up expired pulses
    pulsesRef.current = pulsesRef.current.filter(
      p => now - p.startedAt < p.duration + fadeDuration
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
              1 -
                (now - pulse.startedAt) / (pulse.duration + fadeDuration * 0.5)
            );
            intensity = Math.max(
              intensity,
              (1 - pDist / ringWidth) * pFade * fade
            );
          }
        }

        if (intensity <= 0.005 && gridOpacity <= 0) continue;

        const strokeAlpha =
          gridOpacity + intensity * (maxOpacity - gridOpacity);

        ctx.beginPath();
        roundRect(
          ctx,
          cellX + 0.5,
          cellY + 0.5,
          cellSize - 1,
          cellSize - 1,
          cellRadius
        );

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
  }, [
    cellSize,
    computeFalloff,
    fillOpacity,
    gridOpacity,
    lineWidth,
    maxOpacity,
    cellRadius,
    roundRect,
    holdTime,
    fadeDuration,
    radius,
  ]);

  useEffect(() => {
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
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

      // Keep the content-overlap check fresh every move so the trail steps
      // aside the instant it crosses onto a card or any other element.
      const { rgb, overContent } = classifyAt(e.clientX, e.clientY);
      overContentRef.current = overContent;

      // Sample adaptive color every 80ms max
      const now = performance.now();
      if (now - lastSample > 80) {
        lastSample = now;
        adaptiveRgbRef.current = invertRgb(...rgb);
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
        zIndex: 1, // behind all page content (containers z-index:2+)
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
