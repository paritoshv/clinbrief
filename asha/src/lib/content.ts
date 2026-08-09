/**
 * Illustrative content. None of this describes a real patient or a real call.
 *
 * NOTE FOR THE TEAM: the vernacular strings below are written to read naturally,
 * but every one of them should be checked by a native speaker before this page
 * goes public. A wrong nukta or a stilted phrasing is exactly the tell this
 * product cannot afford.
 */

export interface Dye {
  id: string;
  /** English name of the language. */
  name: string;
  /** The language's own name, in its own script. */
  endonym: string;
  /** The patient's complaint, as she would say it. */
  utterance: string;
  /** Ink colour for this dye. Every value sits inside the basin's indigo/carbon/teal
   *  band — a rainbow here would break the world in its most visible control. */
  hex: string;
  /** CSS variable holding the Noto face for this script. */
  fontVar: string;
}

export const DYES: Dye[] = [
  {
    id: "hi",
    name: "Hindi",
    endonym: "हिन्दी",
    utterance: "पैरों में जलन होती है, रात को ज़्यादा",
    hex: "#0B1D3A",
    fontVar: "var(--font-deva)",
  },
  {
    id: "bn",
    name: "Bengali",
    endonym: "বাংলা",
    utterance: "পায়ে জ্বালা করে, রাতে বেশি",
    hex: "#243A63",
    fontVar: "var(--font-beng)",
  },
  {
    id: "ta",
    name: "Tamil",
    endonym: "தமிழ்",
    utterance: "கால்களில் எரிச்சல், இரவில் அதிகம்",
    hex: "#1A1A1A",
    fontVar: "var(--font-taml)",
  },
  {
    id: "te",
    name: "Telugu",
    endonym: "తెలుగు",
    utterance: "కాళ్లలో మంట, రాత్రి ఎక్కువ",
    hex: "#1B4746",
    fontVar: "var(--font-telu)",
  },
  {
    id: "mr",
    name: "Marathi",
    endonym: "मराठी",
    utterance: "पायांमध्ये जळजळ होते, रात्री जास्त",
    hex: "#2E2A5C",
    fontVar: "var(--font-deva)",
  },
  {
    id: "kn",
    name: "Kannada",
    endonym: "ಕನ್ನಡ",
    utterance: "ಕಾಲುಗಳಲ್ಲಿ ಉರಿ, ರಾತ್ರಿ ಹೆಚ್ಚು",
    hex: "#34506B",
    fontVar: "var(--font-knda)",
  },
  {
    id: "ml",
    name: "Malayalam",
    endonym: "മലയാളം",
    utterance: "കാലുകളിൽ എരിച്ചിൽ, രാത്രിയിൽ കൂടുതൽ",
    hex: "#16384A",
    fontVar: "var(--font-mlym)",
  },
  {
    id: "gu",
    name: "Gujarati",
    endonym: "ગુજરાતી",
    utterance: "પગમાં બળતરા થાય છે, રાત્રે વધારે",
    hex: "#3D2F55",
    fontVar: "var(--font-gujr)",
  },
  {
    id: "pa",
    name: "Punjabi",
    endonym: "ਪੰਜਾਬੀ",
    utterance: "ਪੈਰਾਂ ਵਿੱਚ ਜਲਨ ਹੁੰਦੀ ਹੈ, ਰਾਤ ਨੂੰ ਜ਼ਿਆਦਾ",
    hex: "#1F4E8C",
    fontVar: "var(--font-guru)",
  },
  {
    id: "or",
    name: "Odia",
    endonym: "ଓଡ଼ିଆ",
    utterance: "ପାଦରେ ଜଳୁଛି, ରାତିରେ ଅଧିକ",
    hex: "#2B3446",
    fontVar: "var(--font-orya)",
  },
];

/** The one line of the brief that never changes, whichever dye went into the water. */
export const INVARIANT_LINE = "Burning in both feet, worse at night.";

export interface CallTurn {
  speaker: "asha" | "patient";
  /** What was said, in the patient's language. ClinBrief's turns are shown in Hindi here. */
  said: string;
  /** Plain-English gloss for a reader who does not read the script. */
  gloss: string;
  /** What this turn contributed to the brief, if anything. */
  caught?: string;
}

export const CALL: CallTurn[] = [
  {
    speaker: "asha",
    said: "नमस्ते, मैं [Hospital] की ओर से ClinBrief से बोल रही हूँ। कल आपका अपॉइंटमेंट है डॉक्टर के साथ। अभी बात करने का सही समय है?",
    gloss: "Namaste, this is ClinBrief calling from [Hospital]. You have an appointment with the doctor tomorrow. Is now a good time to talk?",
  },
  {
    speaker: "patient",
    said: "हाँ बोलिए।",
    gloss: "Yes, go ahead.",
  },
  {
    speaker: "asha",
    said: "डॉक्टर को दिखाने की वजह क्या है? अपने शब्दों में बताइए।",
    gloss: "What's bringing you to the doctor? Tell me in your own words.",
  },
  {
    speaker: "patient",
    said: "पैरों में जलन होती है… जैसे चुभन हो रही है। रात को ज़्यादा। नींद खुल जाती है।",
    gloss: "There's a burning in my feet… like pricking. Worse at night. It wakes me up.",
    caught: "Burning in both feet, worse at night. Waking her twice most nights.",
  },
  {
    speaker: "asha",
    said: "कब से हो रहा है?",
    gloss: "How long has this been going on?",
  },
  {
    speaker: "patient",
    said: "तीन महीने से, शायद। होली के आसपास से शुरू हुआ।",
    gloss: "About three months. It started around Holi.",
    caught: "Onset ~3 months.",
  },
  {
    speaker: "asha",
    said: "आप कोई दवा लेती हैं अभी?",
    gloss: "Are you taking any medication at the moment?",
  },
  {
    speaker: "patient",
    said: "शुगर की गोली है। सुबह-शाम। शाम वाली कभी-कभी छूट जाती है…",
    gloss: "There's a tablet for sugar. Morning and evening. The evening one gets missed sometimes…",
    caught: "Metformin, twice daily. Evening dose self-reported as missed. Flagged unresolved — she changed the subject.",
  },
];

export interface BriefField {
  label: string;
  lines: string[];
  /** Set when the entry is a gap rather than a finding. */
  unresolved?: boolean;
}

export const BRIEF: BriefField[] = [
  {
    label: "Presenting complaint",
    lines: [
      "Burning in both feet, worse at night, ~3 months.",
      "Now waking her twice most nights.",
      "Her words: “jaise chubhan ho rahi hai”.",
    ],
  },
  {
    label: "History",
    lines: [
      "Type 2 diabetes. Patient reports “sugar” for about six years.",
      "Metformin 500 mg twice daily.",
      "Evening dose missed roughly three days a week — self-reported.",
      "No prior foot ulcer. No visual disturbance reported.",
    ],
  },
  {
    label: "Screened, negative",
    lines: [
      "No chest pain · No breathlessness · No fever",
      "No new weakness · No wound or discolouration on either foot",
    ],
  },
  {
    label: "Context worth knowing",
    lines: [
      "Travels 40 km by bus to reach this appointment.",
      "Asked twice whether she needs to come fasting.",
      "Daughter-in-law manages her medicines at home.",
    ],
  },
  {
    label: "Unresolved — worth asking",
    unresolved: true,
    lines: [
      "Cannot recall any HbA1c value. No records at home.",
      "Volunteered the missed evening dose, then moved on.",
      "Said “ghutno mein bhi” once and did not elaborate.",
    ],
  },
];

export const CALL_META = {
  language: "Hindi",
  duration: "9 min 12 s",
  placed: "18:42, day before appointment",
  outcome: "Completed",
};
