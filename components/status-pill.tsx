const STATUS_URL = "https://status.vulnix.dev";

/** The product's canonical, static status destination. */
export function StatusPill() {
  return (
    <a className="status-pill" href={STATUS_URL} target="_blank" rel="noopener noreferrer">
      <span aria-hidden className="status-pill-dot" />
      System status
    </a>
  );
}
