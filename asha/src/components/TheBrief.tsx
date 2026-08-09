import { BRIEF, CALL_META } from "@/lib/content";
import { Deckle, Settle, Sheet } from "./ui";

const META_ROWS = [
  ["Language", CALL_META.language],
  ["Duration", CALL_META.duration],
  ["Placed", CALL_META.placed],
  ["Outcome", CALL_META.outcome],
] as const;

export default function TheBrief() {
  return (
    <Sheet id="brief" tone="ink" className="py-24 md:py-36">
      <div className="mx-auto max-w-[92rem] px-6 md:px-10">
        <Settle>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,34rem)_1fr]">
            <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)]">
              What the doctor opens, ninety seconds before.
            </h2>
            <div className="self-end">
              <p
                className="measure text-[1.0625rem] leading-[1.62]"
                style={{ color: "color-mix(in srgb, var(--color-paper) 74%, var(--color-current))" }}
              >
                One page. The patient&rsquo;s own words kept where they matter, the negatives that
                were actually screened, and — the part most systems leave out — an honest list of
                what ClinBrief could not settle.
              </p>
            </div>
          </div>
        </Settle>

        {/* The lifted sheet. */}
        <Settle delay={120}>
          <article
            className="sheet relative mx-auto mt-16 max-w-[52rem] px-7 py-10 md:mt-20 md:px-14 md:py-14"
            style={{
              // The card sits inside the ink sheet, so it has to reclaim the
              // paper-ground foreground rather than inherit white-on-white.
              color: "var(--color-depth)",
              boxShadow: "0 34px 70px -28px rgba(4, 12, 26, 0.62), 0 6px 16px -8px rgba(4, 12, 26, 0.4)",
            }}
          >
            {/* The thesis names this object: the sheet lifted off the water. It has
                to tear like one. */}
            <Deckle ground="var(--color-paper)" />

            <header className="relative z-[1] mb-9 md:mb-11">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h3 className="text-[1.375rem] tracking-[-0.02em]">Pre-consultation brief</h3>
                <p className="label" style={{ color: "var(--color-quiet)" }}>
                  Illustrative — not a real patient
                </p>
              </div>

              <div className="rule mt-5" />

              <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                {META_ROWS.map(([k, v]) => (
                  <div key={k}>
                    <dt className="label mb-1.5" style={{ color: "var(--color-quiet)" }}>
                      {k}
                    </dt>
                    <dd
                      className="font-mono text-[0.8125rem] leading-[1.4]"
                      style={{ color: "var(--color-depth)" }}
                    >
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </header>

            <div className="relative z-[1] space-y-8 md:space-y-9">
              {BRIEF.map((field) => (
                <div key={field.label}>
                  <div
                    className="mb-3 h-px"
                    style={{
                      background: field.unresolved
                        ? "color-mix(in srgb, var(--color-current) 55%, transparent)"
                        : "color-mix(in srgb, var(--color-dilute) 32%, transparent)",
                    }}
                  />
                  <p
                    className="label mb-3"
                    style={{ color: field.unresolved ? "var(--color-current)" : "var(--color-quiet)" }}
                  >
                    {field.label}
                  </p>
                  <ul className="space-y-1.5">
                    {field.lines.map((line) => (
                      <li
                        key={line}
                        className="text-[0.9688rem] leading-[1.62]"
                        style={{ color: "color-mix(in srgb, var(--color-depth) 88%, var(--color-dilute))" }}
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <footer className="relative z-[1] mt-11 border-t pt-5" style={{ borderColor: "color-mix(in srgb, var(--color-dilute) 32%, transparent)" }}>
              <p className="text-[0.875rem] leading-[1.6]" style={{ color: "var(--color-quiet)" }}>
                Every line is attributed to something the patient said. ClinBrief records; it does not
                interpret, rank, or decide.
              </p>
            </footer>
          </article>
        </Settle>
      </div>
    </Sheet>
  );
}
