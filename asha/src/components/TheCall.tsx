import { CALL } from "@/lib/content";
import { Settle, Sheet } from "./ui";

export default function TheCall() {
  return (
    <Sheet id="call" tone="paper" className="py-24 md:py-36">
      <div className="mx-auto max-w-[92rem] px-6 md:px-10">
        <Settle>
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,34rem)_1fr]">
            <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)]">The evening before the appointment.</h2>
            <div className="self-end">
              <p
                className="measure text-[1.0625rem] leading-[1.62]"
                style={{ color: "color-mix(in srgb, var(--color-depth) 72%, var(--color-dilute))" }}
              >
                ClinBrief calls once. It names the hospital before anything else, because a patient
                who does not know who is calling has already stopped listening. Then she asks the
                questions the doctor would have asked anyway, and lets the patient answer at their
                own pace.
              </p>
            </div>
          </div>
        </Settle>

        <div className="rule mt-14 mb-3" />
        <p className="label" style={{ color: "var(--color-quiet)" }}>
          Illustrative example — not a real patient
        </p>

        <div className="mt-12 space-y-9 md:mt-16 md:space-y-11">
          {CALL.map((turn, i) => (
            <Settle key={i} delay={Math.min(i * 45, 220)}>
              <div className="grid gap-x-12 gap-y-4 md:grid-cols-[minmax(0,40rem)_minmax(0,20rem)]">
                <div className={turn.speaker === "asha" ? "md:pl-0" : "md:pl-10"}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    {turn.speaker === "patient" && (
                      <span
                        className="inline-block h-[7px] w-[7px] rounded-full"
                        style={{ background: "var(--color-depth)" }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="label"
                      style={{
                        color: turn.speaker === "asha" ? "var(--color-quiet)" : "var(--color-current)",
                      }}
                    >
                      {turn.speaker === "asha" ? "ClinBrief" : "Patient"}
                    </span>
                  </div>

                  <p
                    className="text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.72]"
                    style={{
                      fontFamily: "var(--font-deva)",
                      color: turn.speaker === "asha" ? "color-mix(in srgb, var(--color-depth) 72%, var(--color-quiet))" : "var(--color-depth)",
                    }}
                    lang="hi"
                  >
                    {turn.said}
                  </p>

                  <p
                    className="mt-2.5 text-[0.9375rem] leading-[1.6]"
                    style={{ color: "var(--color-quiet)" }}
                  >
                    {turn.gloss}
                  </p>
                </div>

                {turn.caught && (
                  <aside className="md:pt-9">
                    <div
                      className="border-t pt-3"
                      style={{ borderColor: "color-mix(in srgb, var(--color-current) 34%, transparent)" }}
                    >
                      <p className="label mb-2" style={{ color: "var(--color-current)" }}>
                        Into the brief
                      </p>
                      <p
                        className="font-mono text-[0.8125rem] leading-[1.65]"
                        style={{ color: "color-mix(in srgb, var(--color-depth) 80%, var(--color-dilute))" }}
                      >
                        {turn.caught}
                      </p>
                    </div>
                  </aside>
                )}
              </div>
            </Settle>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
