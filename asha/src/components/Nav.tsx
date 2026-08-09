"use client";

import { useEffect, useState } from "react";
import { DEMO_URL } from "./Hero";
import { ExternalArrow, RippleMark } from "./ui";

const LINKS = [
  { href: "#call", label: "The call" },
  { href: "#brief", label: "The brief" },
  { href: "#languages", label: "Languages" },
  { href: "#limits", label: "Limits" },
];

export default function Nav() {
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setLanded(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        backgroundColor: landed ? "color-mix(in srgb, var(--color-paper) 88%, transparent)" : "transparent",
        backdropFilter: landed ? "blur(10px)" : "none",
        borderBottom: landed
          ? "1px solid color-mix(in srgb, var(--color-dilute) 30%, transparent)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-[92rem] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <a href="#top" className="flex items-center gap-2.5 text-depth" aria-label="ClinBrief, back to top">
          <RippleMark size={21} />
          <span className="text-[1.0625rem] tracking-[0.2em] uppercase">ClinBrief</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              /* Note: the theme defines a `current` colour token, so Tailwind's
                 `text-current` no longer means currentColor here. Set it explicitly. */
              className="text-[0.875rem] transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--color-current)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden text-[0.8125rem] sm:inline" style={{ color: "var(--color-current)" }}>
            Write to us
          </a>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pill pill-solid px-4 py-2 text-[0.8125rem]"
          >
            Live demo
            <ExternalArrow />
          </a>
        </div>
      </div>
    </header>
  );
}
