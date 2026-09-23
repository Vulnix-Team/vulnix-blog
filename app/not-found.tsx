import Link from "next/link";

export default function NotFound() {
  return <section className="not-found"><p className="eyebrow"><span className="signal-dot" /> Signal lost</p><h1>This field note does not exist.</h1><Link className="cta-link" href="/">Back to the blog <span aria-hidden>↗</span></Link></section>;
}
