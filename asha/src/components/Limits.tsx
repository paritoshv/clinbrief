import { Settle, Sheet } from "./ui";

const REFUSALS = [
  "Diagnose, or suggest what the diagnosis might be.",
  "Triage, or decide which patient is urgent.",
  "Give advice, adjust a dose, or answer a clinical question.",
  "Fill a gap with something plausible when the patient did not say it.",
];

export default function Limits() {
  return (
    <Sheet id="limits" tone="deep" className="py-24 md:py-36">
      <div className="mx-auto max-w-[92rem] px-6 md:px-10">
        <div className="grid gap-x-16 gap-y-12 md:grid-cols-[minmax(0,32rem)_1fr]">
          <Settle>
            <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)]">What ClinBrief will not do.</h2>
            <p
              className="measure mt-7 text-[1.0625rem] leading-[1.66]"
              style={{ color: "color-mix(in srgb, var(--color-depth) 72%, var(--color-dilute))" }}
            >
              A history-taking agent that quietly starts practising medicine is a liability for the
              hospital that deployed it and a danger to the patient who trusted it. The boundary is
              a design constraint, not a disclaimer at the bottom of the page.
            </p>
          </Settle>

          <Settle delay={90}>
            <ul>
              {/* Unnumbered: these are an unordered set of refusals, and a counter
                  would imply a sequence the reader does not need. */}
              {REFUSALS.map((r) => (
                <li
                  key={r}
                  className="border-t py-5"
                  style={{ borderColor: "color-mix(in srgb, var(--color-dilute) 40%, transparent)" }}
                >
                  <span className="text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.5]">{r}</span>
                </li>
              ))}
              <li className="rule" aria-hidden="true" />
            </ul>

            <p
              className="mt-8 text-[1.0625rem] leading-[1.66]"
              style={{ color: "color-mix(in srgb, var(--color-depth) 72%, var(--color-dilute))" }}
            >
              When ClinBrief is unsure, the brief says so. An honest gap is worth more to a doctor than a
              confident guess, and it is the only version of this product worth building.
            </p>
          </Settle>
        </div>
      </div>
    </Sheet>
  );
}
