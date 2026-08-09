import { Settle, Sheet } from "./ui";

const POINTS = [
  {
    head: "Nothing to install, nothing to log in to.",
    body: "No app, no OTP, no onboarding, no smartphone. A phone call reaches the patient with a feature phone and the patient who has never installed anything in their life.",
  },
  {
    head: "Reading is not a requirement.",
    body: "A form excludes anyone who cannot read the language it is printed in. Speech does not. This is not an accessibility footnote for us; it is the reason the product is a call.",
  },
  {
    head: "The first eight seconds decide the rest.",
    body: "An unexpected call from an unknown number is usually a fraud attempt, and patients are right to treat it that way. So ClinBrief names the hospital first, says why it is calling, and asks whether now is a good time.",
  },
];

export default function WhyPhone() {
  return (
    <Sheet tone="paper" className="py-24 md:py-36">
      <div className="mx-auto max-w-[92rem] px-6 md:px-10">
        <Settle>
          <h2 className="display max-w-[20ch] text-[clamp(2rem,4.4vw,3.4rem)]">
            A phone call is the accessibility strategy.
          </h2>
        </Settle>

        <div className="mt-14 md:mt-20">
          {POINTS.map((p, i) => (
            <Settle key={p.head} delay={i * 70}>
              <div
                className="grid gap-x-14 gap-y-3 border-t py-8 md:grid-cols-[minmax(0,26rem)_minmax(0,38rem)] md:py-10"
                style={{ borderColor: "color-mix(in srgb, var(--color-dilute) 34%, transparent)" }}
              >
                <h3 className="text-[clamp(1.1875rem,1.9vw,1.5rem)] leading-[1.32] tracking-[-0.02em]">
                  {p.head}
                </h3>
                <p
                  className="text-[1.0625rem] leading-[1.66]"
                  style={{ color: "color-mix(in srgb, var(--color-depth) 72%, var(--color-dilute))" }}
                >
                  {p.body}
                </p>
              </div>
            </Settle>
          ))}
          <div className="rule" />
        </div>
      </div>
    </Sheet>
  );
}
