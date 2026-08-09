import { Arrow, ExternalArrow } from "./ui";

export const DEMO_URL = "https://pkyffh3bhn.us-west-2.awsapprunner.com/";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end pb-16 md:items-center md:pb-0">
      {/* The still margin: a paper wash so type never sits on moving ink. On phones
          the type sits low, so the margin runs bottom-up and leaves the water open
          above it; on desktop it runs left-in. */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(0deg, color-mix(in srgb, var(--color-paper) 95%, transparent) 0%, color-mix(in srgb, var(--color-paper) 90%, transparent) 42%, color-mix(in srgb, var(--color-paper) 30%, transparent) 68%, transparent 88%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] md:block"
        style={{
          background:
            "linear-gradient(100deg, color-mix(in srgb, var(--color-paper) 94%, transparent) 0%, color-mix(in srgb, var(--color-paper) 88%, transparent) 34%, color-mix(in srgb, var(--color-paper) 34%, transparent) 62%, transparent 100%)",
        }}
      />

      {/* Paper edge along the top, so the nav keeps its contrast wherever the ink
          happens to drift. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-paper) 92%, transparent) 0%, color-mix(in srgb, var(--color-paper) 62%, transparent) 46%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-6 md:px-10">
        <div className="max-w-[46rem]">
          <h1 className="display text-[clamp(2.6rem,7.2vw,5.6rem)]">
            The history, taken before
            <br className="hidden sm:block" /> the patient sits down.
          </h1>

          <p
            className="measure mt-8 text-[clamp(1.0625rem,1.55vw,1.3125rem)] leading-[1.62]"
            style={{ color: "color-mix(in srgb, var(--color-depth) 76%, var(--color-dilute))" }}
          >
            ClinBrief phones your patients before their appointment, holds the whole conversation in the
            language they actually speak, and leaves a structured brief on the doctor&rsquo;s screen
            before the door opens.
          </p>

          {/* A working demo is the strongest thing a pre-launch product can offer,
              so it takes the primary action and the reading of the brief steps back. */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-solid"
            >
              Try the live demo
              <ExternalArrow />
            </a>
            <a href="#brief" className="pill pill-ghost">
              Read the brief it produces
              <Arrow />
            </a>
            <a href="#contact" className="pill pill-ghost">
              Talk to us about a pilot
            </a>
          </div>

          {/* Shown on touch too — dragging is the most natural thing to do on a
              phone, and hiding the hint there hid the interaction from the people
              most likely to try it. */}
          <p className="label mt-10 md:mt-12" style={{ color: "var(--color-quiet)" }}>
            Drag across the water to stir it
          </p>
        </div>
      </div>
    </section>
  );
}
