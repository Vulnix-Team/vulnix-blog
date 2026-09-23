export function FooterWordmarkReveal() {
  return (
    <div aria-hidden className="footer-reveal-panel">
      {/* eslint-disable-next-line @next/next/no-img-element -- canonical brand asset */}
      <img src="/vulnix-logo.svg" alt="" loading="eager" />
    </div>
  );
}
