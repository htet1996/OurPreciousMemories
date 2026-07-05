import { useEffect, useRef } from "react";

/**
 * Canvas fireworks — colorful shells that burst into fading, gravity-pulled
 * sparks. Launches repeated bursts for `duration` ms, then clears itself.
 */
const COLORS = [
  "#FF69B4",
  "#FFB6C1",
  "#DDA0DD",
  "#E6E6FA",
  "#B76E79",
  "#FFD1DC",
  "#FFE08A",
  "#FFFFFF",
];

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export default function Fireworks({ duration = 2000 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    let sparks: Spark[] = [];

    const burst = (cx: number, cy: number) => {
      const count = 42 + Math.floor(Math.random() * 34);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const speed = 3 + Math.random() * 3;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const s = speed * (0.6 + Math.random() * 0.6);
        const life = 50 + Math.floor(Math.random() * 40);
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * s,
          vy: Math.sin(angle) * s,
          life,
          maxLife: life,
          // Mostly one color per shell, with occasional white sparkle.
          color: Math.random() < 0.15 ? "#FFFFFF" : color,
          size: 1.6 + Math.random() * 2.2,
        });
      }
    };

    const startT = performance.now();
    let lastBurst = 0;
    let raf = 0;

    // Fire a couple immediately for instant impact.
    burst(W() * 0.5, H() * 0.4);

    const tick = (t: number) => {
      const elapsed = t - startT;

      // Trail effect: fade the previous frame slightly instead of clearing.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      if (elapsed < duration && t - lastBurst > 160) {
        burst(W() * (0.2 + Math.random() * 0.6), H() * (0.2 + Math.random() * 0.35));
        lastBurst = t;
      }

      for (const p of sparks) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045; // gravity
        p.vx *= 0.99;
        p.life -= 1;
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      sparks = sparks.filter((p) => p.life > 0);

      if (elapsed < duration || sparks.length > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
