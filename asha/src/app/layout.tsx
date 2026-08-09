import type { Metadata } from "next";
import {
  Schibsted_Grotesk,
  Azeret_Mono,
  Noto_Sans_Devanagari,
  Noto_Sans_Bengali,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_Gujarati,
  Noto_Sans_Gurmukhi,
  Noto_Sans_Oriya,
} from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const azeret = Azeret_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-azeret",
  display: "swap",
});

/* The script faces are the product's argument, so they are real faces rather than a
   fallback stack. Each is unpreloaded so none of them block the basin, and each has
   to be its own module-scope const — next/font resolves these at build time. */
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400"], variable: "--font-deva", display: "swap", preload: false });
const beng = Noto_Sans_Bengali({ subsets: ["bengali"], weight: ["400"], variable: "--font-beng", display: "swap", preload: false });
const taml = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400"], variable: "--font-taml", display: "swap", preload: false });
const telu = Noto_Sans_Telugu({ subsets: ["telugu"], weight: ["400"], variable: "--font-telu", display: "swap", preload: false });
const knda = Noto_Sans_Kannada({ subsets: ["kannada"], weight: ["400"], variable: "--font-knda", display: "swap", preload: false });
const mlym = Noto_Sans_Malayalam({ subsets: ["malayalam"], weight: ["400"], variable: "--font-mlym", display: "swap", preload: false });
const gujr = Noto_Sans_Gujarati({ subsets: ["gujarati"], weight: ["400"], variable: "--font-gujr", display: "swap", preload: false });
const guru = Noto_Sans_Gurmukhi({ subsets: ["gurmukhi"], weight: ["400"], variable: "--font-guru", display: "swap", preload: false });
const orya = Noto_Sans_Oriya({ subsets: ["oriya"], weight: ["400"], variable: "--font-orya", display: "swap", preload: false });

const INDIC = [deva, beng, taml, telu, knda, mlym, gujr, guru, orya];

export const metadata: Metadata = {
  metadataBase: new URL("https://clinbrief.com"),
  title: "ClinBrief — the history, taken before the patient sits down",
  description:
    "ClinBrief phones patients before a scheduled consultation, takes the history in the language they actually speak, and leaves a structured brief on the doctor's screen before the door opens.",
  openGraph: {
    title: "ClinBrief — the history, taken before the patient sits down",
    description:
      "A voice agent that calls patients before their appointment, in any of India's languages, and hands the doctor a structured pre-consultation brief.",
    type: "website",
  },
};

const CONTRACT = `<!--
THESIS: A suminagashi basin. The call is ink floating on water; the doctor's brief is the
sheet lifted off it. Refuses the AI-health hero: no dark gradient, no glowing waveform, no
tilted dashboard mockup.
OWN-WORLD: Indigo #0B1D3A and carbon sumi on cool paper white #F6F7F8. One live WebGL fluid
behind the whole page; washi sheets with deckled edges laid over it; hairline rules,
wide-tracked mono labels, pill buttons that ink-fill on press.
STORY: ClinBrief phones patients before a consultation in their own language and hands the doctor
a structured brief. The visitor comes to believe the wedge is language coverage plus honesty
about what is not yet built, and acts by writing to the founder.
FIRST VIEWPORT: Full-bleed live basin, ink dropping as the page loads. Quiet type held to the
left margin, one headline, the primary action on paper beneath it.
FORM: Fluid Ink Basin — catalog challenger, user-pinned over assigned candidate 5. Seed 86f5c2d0.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = [schibsted.variable, azeret.variable, ...INDIC.map((f) => f.variable)].join(" ");

  return (
    /* The inline script below stamps `js` on <html> before hydration, which React
       would otherwise report as a mismatch. */
    <html lang="en" suppressHydrationWarning>
      <body className={fontVars}>
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />

        {/* Marks the document once JS is live, so the settle transition only ever
            applies where it can actually be released. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />

        {/* Deckle displacement, defined once and referenced by every sheet edge. */}
        <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
          <filter id="deckle" x="-5%" y="-60%" width="110%" height="220%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.14" numOctaves="4" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="17" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {children}
      </body>
    </html>
  );
}
