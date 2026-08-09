"use client";

import { useEffect, useRef } from "react";
import { InkBasinSim, hexToVec3 } from "@/lib/fluid";

/* A single basin runs behind the entire page, so any section can put ink in the
   water. Kept as a module handle rather than context — one canvas, one owner. */
let active: InkBasinSim | null = null;
let bloomFn: ((x: number, y: number, force: number) => void) | null = null;

/** Drop a dye into the shared basin. Coordinates are 0..1, origin bottom-left. */
export function dropInk(x: number, y: number, hex: string, strength = 0.85, radiusScale = 1.4) {
  if (!active) return;
  active.drop(x, y, hexToVec3(hex), strength, radiusScale);
  bloomFn?.(x, y, 1200);
}

export default function InkBasin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<InkBasinSim | null>(null);
  const overturePlayed = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // One context for the life of the page. StrictMode remounts reuse it.
    let sim = simRef.current;
    if (!sim) {
      try {
        sim = new InkBasinSim(canvas, {
          // Phones get a smaller dye field; the marbling reads the same and the
          // fragment cost roughly halves.
          dyeRes: window.innerWidth < 768 ? 440 : 700,
          simRes: window.innerWidth < 768 ? 96 : 128,
        });
      } catch (err) {
        // No WebGL2 or no float targets: the CSS fallback layer stands in.
        console.error("[basin] simulation unavailable:", err);
        canvas.style.display = "none";
        return;
      }
      simRef.current = sim;
    }

    active = sim;
    sim.resize();

    /* A drop hitting water pushes the surface outward. One gaussian can't do that,
       so the impulse is dealt around a ring. */
    const bloom = (x: number, y: number, force: number) => {
      const petals = 9;
      for (let i = 0; i < petals; i++) {
        const a = (i / petals) * Math.PI * 2 + Math.random() * 0.3;
        const r = 0.014;
        sim.stir(x + Math.cos(a) * r, y + Math.sin(a) * r, Math.cos(a) * force, Math.sin(a) * force, 1.1);
      }
    };
    bloomFn = bloom;

    const INDIGO = "#0b1d3a";
    const CARBON = "#1a1a1a";
    const CURRENT = "#243a63";

    /* The opening. Three drops and one drawn breath across them — the suminagashi
       sequence, not a loop of random splats. */
    /* Real suminagashi is drop, drop, drop — then a breath across the rings, then a
       comb drawn through them. The comb is what turns concentric rings into the
       feathered pattern; without it the surface is just blots. */
    const overture: Array<[number, () => void]> = [
      /* Indigo carries the hue and carbon stays a minor note. An equal carbon drop
         averages the whole basin to neutral grey, which is the one colour this
         world cannot be. */
      [200, () => { sim.drop(0.62, 0.46, hexToVec3(INDIGO), 1.05, 1.5); bloom(0.62, 0.46, 1400); }],
      [800, () => { sim.drop(0.71, 0.37, hexToVec3(CURRENT), 0.8, 1.1); bloom(0.71, 0.37, 1050); }],
      [1400, () => { sim.drop(0.55, 0.4, hexToVec3(INDIGO), 0.7, 1.0); bloom(0.55, 0.4, 950); }],
      [1950, () => { sim.drop(0.67, 0.42, hexToVec3(CARBON), 0.3, 0.7); bloom(0.67, 0.42, 700); }],
      [2450, () => {
        // The breath, drawn across the rings. Mild and biased slightly downward: a
        // hard push drives the pattern into the right wall and up behind the nav.
        for (let i = 0; i < 16; i++) {
          const t = i / 15;
          sim.stir(0.44 + t * 0.28, 0.45 + Math.sin(t * Math.PI) * 0.08, 900, -280, 2.6);
        }
      }],
      [3150, () => {
        // The comb: two strokes pulled down through the bands to feather them.
        for (const x of [0.54, 0.66]) {
          for (let i = 0; i < 9; i++) {
            sim.stir(x, 0.58 - (i / 8) * 0.28, 140, -900, 2.0);
          }
        }
      }],
    ];

    if (reduced) {
      // Still water: compose the pattern once, present it, and stop.
      if (!overturePlayed.current) {
        overturePlayed.current = true;
        overture.forEach(([, fn]) => fn());
        sim.settle(240);
      }
      return () => {
        sim.stop();
      };
    }

    /* Scheduled once for the life of the page and deliberately never cancelled:
       the sim outlives this effect, so a StrictMode cleanup that cleared these
       would leave the basin empty forever. */
    if (!overturePlayed.current) {
      overturePlayed.current = true;
      overture.forEach(([delay, fn]) => window.setTimeout(fn, delay));
    }

    /* Pointer stirs the surface. The canvas itself never takes pointer events, so
       scrolling and every control above it behave normally. */
    let px = 0;
    let py = 0;
    let hasPrev = false;

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      if (hasPrev) {
        const dx = (x - px) * 6400;
        const dy = (y - py) * 6400;
        if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) sim.stir(x, y, dx, dy, 1.5);
      }
      px = x;
      py = y;
      hasPrev = true;
    };

    /* Ambient current. Barely there — the basin should read as still, not stirred. */
    let elapsed = 0;
    const drift = (dt: number) => {
      elapsed += dt;
      if (elapsed < 5) return;
      elapsed = 0;
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.15 + Math.random() * 0.7;
      const a = Math.random() * Math.PI * 2;
      sim.stir(x, y, Math.cos(a) * 900, Math.sin(a) * 900, 5);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onVisibility = () => {
      if (document.hidden) sim.stop();
      else sim.start(drift);
    };
    document.addEventListener("visibilitychange", onVisibility);

    sim.start(drift);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      sim.stop();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {/* Static stand-in for clients without WebGL2. Real marbling, no simulation. */}
      <div
        className="absolute inset-0 bg-paper"
        style={{
          backgroundImage:
            "radial-gradient(90% 60% at 62% 52%, rgba(11,29,58,0.16), transparent 62%), radial-gradient(50% 40% at 70% 45%, rgba(26,26,26,0.12), transparent 70%), radial-gradient(60% 50% at 48% 62%, rgba(36,58,99,0.10), transparent 72%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
