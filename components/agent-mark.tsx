"use client";

import { useEffect, useRef, useState } from "react";

// Dot, the Vulnix character - a port of the website's living mark
// (product apps/web/components/marketing/agent-mark.tsx). Its eyes follow the
// pointer, it blinks now and then, and a speech bubble cycles short lines,
// each with its own expression. While the visitor types it looks down.
// The blog passes its own lines per placement; the face and motion are the
// website's, unchanged (brand rule: pose it, never redraw it).
//
// Eyes track via a direct transform, never React state, so following the
// pointer costs no renders. Tracking and blinking only run while the mark is
// on screen; under reduced motion it holds the first line and stays still.

export type Mood = "neutral" | "happy" | "wink" | "squint" | "surprised";

export type Line = { text: string; mood: Mood };

// Every line must describe something the product really does, and fit on
// one line (~40 characters) so the bubble never dips behind what Dot peeks
// over. See docs/brand/voice-and-tone.md "The agent's voice" in the product.
export const BLOG_LINES: Line[] = [
  { text: "No proof, no finding. House rule.", mood: "squint" },
  { text: "Scanners flag it. I prove it.", mood: "wink" },
  { text: "Shipped a fix? I'll re-run the exploit.", mood: "squint" },
  { text: "Code review reads. I try the doors.", mood: "happy" },
  { text: "I only touch what you scope. Promise.", mood: "happy" },
];

const LINE_MS = 4200;
// How far the eyes can travel from centre, in the icon's 100-unit viewBox.
const REACH_X = 9;
const REACH_Y = 7;
// Pointer distance (px) at which the eyes reach full travel.
const FULL_AT = 320;

const EYE = { fill: "#010101" };
const LASH = { fill: "none", stroke: "#010101", strokeWidth: 7, strokeLinecap: "round" as const };

function Eyes({ mood }: { mood: Mood }) {
  const arc = (cx: number) => <path d={`M${cx - 8} 42 Q${cx} 29 ${cx + 8} 42`} {...LASH} />;
  const pill = (x: number) => <rect x={x} y="27" width="10" height="22" rx="5" {...EYE} />;
  switch (mood) {
    case "happy":
      return (
        <>
          {arc(30)}
          {arc(70)}
        </>
      );
    case "wink":
      return (
        <>
          {pill(25)}
          {arc(70)}
        </>
      );
    case "squint":
      return (
        <>
          <rect x="23" y="34" width="14" height="8" rx="4" {...EYE} />
          <rect x="63" y="34" width="14" height="8" rx="4" {...EYE} />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="30" cy="38" r="9" {...EYE} />
          <circle cx="70" cy="38" r="9" {...EYE} />
        </>
      );
    default:
      return (
        <>
          {pill(25)}
          {pill(65)}
        </>
      );
  }
}

/**
 * The mark alone, holding one expression - for sitting inline beside text (the
 * hero headline). It blinks into its expression on mount, so a keyed remount
 * per word reads as the agent reacting to it.
 */
export function MarkFace({ mood, className = "" }: { mood: Mood; className?: string }) {
  const lidRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lidRef.current?.animate([{ transform: "scaleY(0.1)" }, { transform: "scaleY(1)" }], {
      duration: 200,
      delay: 250,
      easing: "ease-out",
      fill: "backwards",
    });
  }, []);
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <rect width="100" height="100" rx="16" fill="#fe4202" />
      <g ref={lidRef} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <Eyes mood={mood} />
      </g>
    </svg>
  );
}

export function AgentMark({
  lines = BLOG_LINES,
  typingLine,
  typing = false,
  className = "",
  markClassName = "size-12 md:size-14",
}: {
  lines?: Line[];
  /** Held while the visitor types, with Dot looking down. */
  typingLine?: Line;
  typing?: boolean;
  className?: string;
  markClassName?: string;
}) {
  const markRef = useRef<SVGSVGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const lidRef = useRef<SVGGElement>(null);
  const typingRef = useRef(typing);
  const [line, setLine] = useState(0);
  const [bubbleIn, setBubbleIn] = useState(true);

  const current = typing && typingLine ? typingLine : lines[line % lines.length];

  // Cycles the lines: fade the bubble out, swap, fade back in. Holds while
  // the visitor types, and never starts under reduced motion.
  useEffect(() => {
    if (typing || lines.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setBubbleIn(false);
      swap = setTimeout(() => {
        setLine((index) => (index + 1) % lines.length);
        setBubbleIn(true);
      }, 220);
    }, LINE_MS);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
    };
  }, [typing, lines.length]);

  // A quick blink into each new expression.
  useEffect(() => {
    lidRef.current?.animate([{ transform: "scaleY(0.1)" }, { transform: "scaleY(1)" }], {
      duration: 160,
      easing: "ease-out",
    });
  }, [current.mood]);

  useEffect(() => {
    typingRef.current = typing;
    // Typing: look down at the box.
    if (typing && eyesRef.current) eyesRef.current.style.transform = `translate(0px, ${REACH_Y}px)`;
  }, [typing]);

  useEffect(() => {
    const mark = markRef.current;
    const eyes = eyesRef.current;
    const lid = lidRef.current;
    if (!mark || !eyes || !lid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    let visible = false;

    const look = () => {
      frame = 0;
      if (!pointer || typingRef.current) return;
      const box = mark.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const pull = Math.min(distance / FULL_AT, 1);
      eyes.style.transform = `translate(${(dx / distance) * pull * REACH_X}px, ${(dy / distance) * pull * REACH_Y}px)`;
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(look);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) window.addEventListener("pointermove", onMove, { passive: true });
      else window.removeEventListener("pointermove", onMove);
    });
    observer.observe(mark);

    // A blink every 3-6s, only while it can be seen.
    let blinkTimer: ReturnType<typeof setTimeout>;
    const blink = () => {
      if (visible) {
        lid.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0.1)" }, { transform: "scaleY(1)" }], {
          duration: 180,
          easing: "ease-in-out",
        });
      }
      blinkTimer = setTimeout(blink, 3000 + Math.random() * 3000);
    };
    blinkTimer = setTimeout(blink, 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      clearTimeout(blinkTimer);
    };
  }, []);

  return (
    <div aria-hidden className={`pointer-events-none flex items-start gap-2 ${className}`}>
      <div
        className={`relative mt-1 rounded-[12px] whitespace-nowrap rounded-br-[4px] bg-mk-fg px-3 py-1.5 font-[family-name:var(--font-marketing-body)] text-[13px] leading-[17px] font-medium text-mk-page shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)] transition-[opacity,translate] duration-200 ease-out ${bubbleIn ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
      >
        {current.text}
      </div>
      <svg ref={markRef} viewBox="0 0 100 100" className={`shrink-0 ${markClassName}`}>
        <rect width="100" height="100" rx="16" fill="#fe4202" />
        <g ref={eyesRef} className="transition-transform duration-200 ease-out">
          <g ref={lidRef} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <Eyes mood={current.mood} />
          </g>
        </g>
      </svg>
    </div>
  );
}
