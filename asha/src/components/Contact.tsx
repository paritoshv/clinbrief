import { Arrow, RippleMark, Settle, Sheet } from "./ui";

const EMAIL = "varshneyparitosh7@gmail.com";

export default function Contact() {
  return (
    <Sheet id="contact" tone="ink" className="pt-24 pb-12 md:pt-36 md:pb-14">
      <div className="mx-auto max-w-[92rem] px-6 md:px-10">
        <Settle>
          <h2 className="display max-w-[16ch] text-[clamp(2.25rem,6vw,4.75rem)]">
            If this should exist, tell us.
          </h2>

          <div className="mt-10 md:mt-12">
            <a
              href={`mailto:${EMAIL}?subject=ClinBrief`}
              className="group inline-flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(1.125rem,2.6vw,1.875rem)] tracking-[-0.02em]"
              style={{ color: "var(--color-paper)" }}
            >
              <span
                className="border-b pb-1 transition-colors duration-300"
                style={{ borderColor: "color-mix(in srgb, var(--color-paper) 45%, transparent)" }}
              >
                {EMAIL}
              </span>
              <Arrow className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          <p
            className="measure mt-8 text-[1.0625rem] leading-[1.66]"
            style={{ color: "color-mix(in srgb, var(--color-paper) 68%, var(--color-current))" }}
          >
            Hospitals, clinicians who would use it, and investors are all welcome. If you work in an
            OPD and think this is wrong, that is the most useful message we could get.
          </p>
        </Settle>

        <footer
          className="mt-24 border-t pt-8 md:mt-32"
          style={{ borderColor: "color-mix(in srgb, var(--color-paper) 22%, transparent)" }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2.5" style={{ color: "var(--color-paper)" }}>
              <RippleMark size={20} />
              <span className="text-[1rem] uppercase tracking-[0.2em]">ClinBrief</span>
            </div>

            <p
              className="max-w-[46ch] text-[0.875rem] leading-[1.6]"
              style={{ color: "color-mix(in srgb, var(--color-paper) 55%, var(--color-current))" }}
            >
              ClinBrief calls on behalf of a hospital, and identifies the hospital before
              anything else.
            </p>
          </div>
        </footer>
      </div>
    </Sheet>
  );
}
