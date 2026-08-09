"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The page's single reveal. Content renders visible; this only releases a settle
 * where motion is welcome, and never gates content behind a script.
 */
export function Settle({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.settled = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.dataset.settled = "true";
          io.disconnect();
        }
      },
      { rootMargin: "-8% 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`settle ${className}`}>
      {children}
    </div>
  );
}

/**
 * A sheet of washi laid on the water. Deckled top and bottom edges are backing
 * layers, so the displacement filter never touches live text.
 */
export function Sheet({
  children,
  className = "",
  id,
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "paper" | "deep" | "ink";
}) {
  const grounds = {
    paper: { bg: "var(--color-paper)", fg: "var(--color-depth)" },
    deep: { bg: "var(--color-paper-deep)", fg: "var(--color-depth)" },
    ink: { bg: "var(--color-depth)", fg: "var(--color-paper)" },
  };
  const g = grounds[tone];

  return (
    <section
      id={id}
      className={`sheet ${className}`}
      style={
        {
          background: g.bg,
          color: g.fg,
          "--sheet-bg": g.bg,
        } as React.CSSProperties
      }
    >
      <span className="deckle deckle--top" aria-hidden="true" />
      {children}
      <span className="deckle deckle--bottom" aria-hidden="true" />
    </section>
  );
}

/**
 * Torn edges for anything that is meant to read as a sheet of paper — cards
 * included, not just full-bleed bands. Separate layers rather than pseudo-
 * elements, so the displacement filter never touches live text.
 */
export function Deckle({ ground }: { ground: string }) {
  return (
    <>
      <span className="deckle deckle--top" style={{ ["--sheet-bg" as string]: ground }} aria-hidden="true" />
      <span className="deckle deckle--bottom" style={{ ["--sheet-bg" as string]: ground }} aria-hidden="true" />
    </>
  );
}

/** The mark: the concentric rings a single drop leaves on still water. */
export function RippleMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`ripple-mark ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      <circle cx="12" cy="12" r="6.1" stroke="currentColor" strokeWidth="1.15" opacity="0.72" />
      <circle cx="12" cy="12" r="10.2" stroke="currentColor" strokeWidth="0.85" opacity="0.38" />
    </svg>
  );
}

/** Leaves the site — drawn at the same stroke weight as the inline arrow. */
export function ExternalArrow({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M5.5 10.5 10.5 5.5M6.5 5.25h4.25V9.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Drawn arrow, one stroke weight across the page. No glyph substitutes. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
