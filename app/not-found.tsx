import Link from "next/link";

import { AgentMark } from "@/components/agent-mark";
import { MAIN_SITE } from "@/lib/site";

// The footer's button pair (site-footer.tsx), without the sliding arrows.
const BUTTON =
  "flex h-[42px] items-center rounded-[12px] px-4 text-[16px] leading-6 font-medium tracking-[-0.16px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fe4202]";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-7 pt-32 pb-16 text-center">
      <AgentMark
        lines={[{ text: "This page is out of my scope.", mood: "surprised" }]}
        className="mb-8"
        markClassName="size-20 md:size-24"
      />
      <p className="text-[12px] leading-[14.4px] font-semibold tracking-[1.08px] text-[#fe4202] uppercase">404</p>
      <h1 className="mt-4 max-w-[640px] font-[family-name:var(--font-marketing-heading)] text-[36px] leading-[1.1] font-medium tracking-[-1.2px] text-balance text-mk-fg md:text-[56px] md:tracking-[-2.2px]">
        This field note does not exist
      </h1>
      <p className="mt-4 max-w-[420px] text-[16px] leading-[22.4px] text-mk-fg/70">
        The link may be old, or the article may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link href="/" className={`${BUTTON} bg-mk-fg text-mk-page hover:bg-mk-fg/85`}>
          Back to the blog
        </Link>
        <a href={MAIN_SITE} className={`${BUTTON} border border-mk-fg/25 text-mk-fg hover:border-mk-fg/50 hover:bg-mk-fg/[0.06]`}>
          Go to vulnix.dev
        </a>
      </div>
    </section>
  );
}
