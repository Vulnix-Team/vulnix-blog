import { ArrowRight } from "lucide-react";

// The reference's line link: a 2px rule under the label that fills from the
// left on hover, and an arrow that swaps for a fresh one sliding in. Purely
// visual - the surrounding link (or whole card) carries `group/link`, so
// hovering anywhere on it plays the animation.
const TONES = {
  ink: { track: "bg-[#d1cdc7]", fill: "bg-[#0e1815]" },
  light: { track: "bg-white/35", fill: "bg-white" },
  // Blog addition: follows the page theme (Ink on light, white on dark).
  page: { track: "bg-mk-fg/30", fill: "bg-mk-fg" },
} as const;

export function LineLink({ label, tone = "ink" }: { label: string; tone?: keyof typeof TONES }) {
  const { track, fill } = TONES[tone];
  return (
    <span className="flex w-fit items-center gap-1 font-[family-name:var(--font-marketing-body)] text-[16px] leading-6 font-medium">
      <span className="relative">
        {label}
        <span aria-hidden className={`absolute inset-x-0 -bottom-[1.6px] h-[2px] overflow-hidden rounded-full ${track}`}>
          <span className={`absolute inset-0 -translate-x-full transition-transform duration-300 ease-out group-hover/link:translate-x-0 ${fill}`} />
        </span>
      </span>
      <span aria-hidden className="relative size-[18px] overflow-hidden">
        <ArrowRight className="absolute inset-0 size-[18px] transition-transform duration-300 ease-out group-hover/link:translate-x-[18px]" strokeWidth={2} />
        <ArrowRight className="absolute inset-0 size-[18px] -translate-x-[18px] transition-transform duration-300 ease-out group-hover/link:translate-x-0" strokeWidth={2} />
      </span>
    </span>
  );
}
