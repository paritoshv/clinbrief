import { Settle } from "./ui";

export default function Standing() {
  return (
    <section className="relative py-24 md:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-paper) 84%, transparent) 0%, color-mix(in srgb, var(--color-paper) 34%, transparent) 40%, color-mix(in srgb, var(--color-paper) 84%, transparent) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[92rem] px-6 md:px-10">
        <Settle>
          <div className="grid gap-x-16 gap-y-9 md:grid-cols-[minmax(0,30rem)_minmax(0,38rem)]">
            <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)]">Where this actually stands.</h2>

            <div className="space-y-6">
              <p
                className="text-[1.0625rem] leading-[1.66]"
                style={{ color: "color-mix(in srgb, var(--color-depth) 76%, var(--color-dilute))" }}
              >
                ClinBrief is pre-launch. There are no pilot hospitals to name, no logo row to show you,
                and no usage numbers we could put on this page honestly. The call and the brief above
                are the product as designed and an example of what it produces — not a case study,
                and not a real patient.
              </p>
              <p
                className="text-[1.0625rem] leading-[1.66]"
                style={{ color: "color-mix(in srgb, var(--color-depth) 76%, var(--color-dilute))" }}
              >
                What we want next is narrow: one or two hospitals willing to let ClinBrief call a real OPD
                list, and to tell us plainly what breaks. If that is a conversation you can have, or
                one you can open a door to, we would like to hear from you.
              </p>
            </div>
          </div>
        </Settle>
      </div>
    </section>
  );
}
