"use client";

import { useEffect, useRef, useState } from "react";
import { DYES, INVARIANT_LINE } from "@/lib/content";
import { dropInk } from "./InkBasin";
import { Deckle, Settle } from "./ui";

/* Each dye lands somewhere different, so ten choices marble the basin instead of
   stacking in one spot. */
const SPOTS: Array<[number, number]> = [
  [0.3, 0.62], [0.46, 0.42], [0.62, 0.66], [0.74, 0.4], [0.38, 0.34],
  [0.56, 0.58], [0.68, 0.52], [0.26, 0.44], [0.5, 0.7], [0.8, 0.58],
];

export default function Languages() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const opened = useRef(false);
  const dye = DYES[active];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !opened.current) {
          opened.current = true;
          dropInk(SPOTS[0][0], SPOTS[0][1], DYES[0].hex, 0.9, 1.6);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const choose = (i: number) => {
    setActive(i);
    const [x, y] = SPOTS[i % SPOTS.length];
    dropInk(x, y, DYES[i].hex, 0.9, 1.6);
  };

  return (
    <section id="languages" ref={sectionRef} className="relative py-24 md:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-paper) 93%, transparent) 0%, color-mix(in srgb, var(--color-paper) 88%, transparent) 40%, color-mix(in srgb, var(--color-paper) 44%, transparent) 72%, color-mix(in srgb, var(--color-paper) 88%, transparent) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[92rem] px-6 md:px-10">
        <Settle>
          <h2 className="display max-w-[26ch] text-[clamp(2rem,4.4vw,3.4rem)]">
            The complaint arrives in a different script every time. The brief comes out identical.
          </h2>
          <p
            className="measure mt-7 text-[1.0625rem] leading-[1.62]"
            style={{ color: "color-mix(in srgb, var(--color-depth) 74%, var(--color-dilute))" }}
          >
            India is not one market and a patient will not switch languages to be understood by
            software. Drop a dye in the water and watch what reaches the doctor stay exactly where
            it was.
          </p>
        </Settle>

        <div className="mt-12 flex flex-wrap gap-2.5 md:mt-14" role="group" aria-label="Choose a language">
          {DYES.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => choose(i)}
              aria-pressed={i === active}
              className="pill border text-[0.875rem] px-4 py-2.5"
              style={{
                background: i === active ? "var(--color-depth)" : "var(--color-paper)",
                color: i === active ? "var(--color-paper)" : "var(--color-depth)",
                borderColor:
                  i === active ? "var(--color-depth)" : "color-mix(in srgb, var(--color-dilute) 45%, transparent)",
              }}
            >
              <span
                className="dye-dot inline-block h-[9px] w-[9px] shrink-0 rounded-full"
                style={{
                  background: d.hex,
                  outline: i === active ? "1px solid rgba(246,247,248,0.5)" : "1px solid transparent",
                }}
                aria-hidden="true"
              />
              <span style={{ fontFamily: d.fontVar }}>{d.endonym}</span>
              <span className="opacity-55">{d.name}</span>
            </button>
          ))}
        </div>

        {/* The language set is intended coverage, not a shipped capability. PRODUCT.md
            forbids claiming a live count, so the page must not imply one. */}
        <p className="mt-5 text-[0.875rem]" style={{ color: "var(--color-quiet)" }}>
          Languages shown illustrate the coverage ClinBrief is being built for. The live set is not
          fixed yet — <span className="font-mono">[TEAM: confirm before publishing]</span>.
        </p>

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-8">
          {/* What went into the water. */}
          <div className="sheet relative px-7 py-8 md:px-9 md:py-10" style={{ boxShadow: "0 22px 48px -26px rgba(4,12,26,0.42)" }}>
            <Deckle ground="var(--color-paper)" />
            <p className="label relative z-[1] mb-5" style={{ color: "var(--color-quiet)" }}>
              What the patient said
            </p>
            <p
              key={dye.id}
              lang={dye.id}
              className="relative z-[1] text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.65]"
              style={{ fontFamily: dye.fontVar, color: "var(--color-depth)" }}
            >
              {dye.utterance}
            </p>
            <p className="relative z-[1] mt-4 text-[0.9375rem]" style={{ color: "var(--color-quiet)" }}>
              {dye.name} · spoken, not typed
            </p>
          </div>

          {/* What came out. Deliberately static — that is the whole point. */}
          <div
            className="sheet relative px-7 py-8 md:px-9 md:py-10"
            style={{ background: "var(--color-depth)", color: "var(--color-paper)" }}
          >
            <Deckle ground="var(--color-depth)" />
            <p className="label relative z-[1] mb-5" style={{ color: "color-mix(in srgb, var(--color-paper) 62%, var(--color-current))" }}>
              What the doctor reads
            </p>
            <p className="relative z-[1] text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.65]">{INVARIANT_LINE}</p>
            <p
              className="relative z-[1] mt-4 text-[0.9375rem]"
              style={{ color: "color-mix(in srgb, var(--color-paper) 60%, var(--color-current))" }}
            >
              Unchanged, whichever dye went in
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
