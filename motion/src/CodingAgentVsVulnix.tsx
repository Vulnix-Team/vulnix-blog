import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

import { CREAM, DOT_GRID, EMBER, EMBER_SOFT, FONT_HEADING, FONT_MONO, LINE, MUTED, SUCCESS, loadBrandFonts } from "./brand";

// "Can Claude Code or Codex Replace a Pentest?" - the article's central
// contrast as a 10s loop. Left: a coding agent reads source and ends on a
// prediction. Right: Vulnix tests the running app, records proof, then
// replays the exploit after the fix. Same synthetic token-expiry example as
// the article text. Starts and ends on the empty panels so the seam is clean.
export const WIDTH = 1280;
export const HEIGHT = 720;
export const FPS = 30;
export const DURATION = 300;
const FADE_OUT: [number, number] = [262, 292];

function p(frame: number, start: number, end: number) {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function rise(value: number, distance = 14): CSSProperties {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` };
}

const CODE = [
  { text: "def create_token(user, body):", tone: "plain" },
  { text: "    scopes = body[\"scopes\"]", tone: "plain" },
  { text: "    expires = body.get(\"expires_at\")", tone: "suspect" },
  { text: "    if expires is None:", tone: "plain" },
  { text: "        expires = now() + days(90)", tone: "plain" },
  { text: "    return Token.create(", tone: "plain" },
  { text: "        user, scopes, expires)", tone: "plain" },
];

function Panel({ title, kicker, accent, children }: { title: string; kicker: string; accent: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        height: "100%",
        border: `1px solid ${LINE}`,
        borderRadius: 18,
        background: "rgba(10, 12, 11, 0.92)",
        padding: "30px 32px",
        overflow: "hidden",
      }}
    >
      <div style={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: accent }}>{kicker}</div>
      <div style={{ marginTop: 8, fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 30, color: CREAM, letterSpacing: "-0.02em" }}>{title}</div>
      {children}
    </div>
  );
}

function Verdict({ label, detail, color, value }: { label: string; detail: string; color: string; value: number }) {
  return (
    <div
      style={{
        ...rise(value),
        position: "absolute",
        left: 32,
        right: 32,
        bottom: 30,
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: `1px solid ${color}`,
        borderRadius: 14,
        padding: "14px 18px",
        background: "rgba(1,1,1,0.9)",
      }}
    >
      <span style={{ fontFamily: FONT_MONO, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontFamily: FONT_HEADING, fontSize: 19, color: CREAM }}>{detail}</span>
    </div>
  );
}

function RequestRow({ method, path, result, ok, value }: { method: string; path: string; result: string; ok: boolean; value: number }) {
  return (
    <div
      style={{
        ...rise(value, 10),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: `1px solid ${LINE}`,
        padding: "11px 0",
        fontFamily: FONT_MONO,
        fontSize: 15,
      }}
    >
      <span style={{ color: CREAM }}>
        <span style={{ color: EMBER_SOFT }}>{method}</span> {path}
      </span>
      <span style={{ color: ok ? SUCCESS : EMBER, whiteSpace: "nowrap" }}>{result}</span>
    </div>
  );
}

export function CodingAgentVsVulnix() {
  loadBrandFonts();
  const frame = useCurrentFrame();
  const out = 1 - p(frame, ...FADE_OUT);

  // Left: scan line sweeps the source, settles on the suspect line.
  const scan = interpolate(frame, [22, 96], [0, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const suspect = p(frame, 96, 112);
  const leftVerdict = p(frame, 118, 136);

  // Right: verified target, exploit requests, proof, fix, replay.
  const target = p(frame, 14, 30);
  const req = [p(frame, 40, 54), p(frame, 62, 76), p(frame, 84, 98)];
  const proof = p(frame, 118, 136);
  const fix = p(frame, 160, 174);
  const replay = p(frame, 184, 198);
  const fixed = p(frame, 214, 232);
  const exploitPhase = 1 - p(frame, 152, 164);

  return (
    <AbsoluteFill style={{ ...DOT_GRID, padding: 36 }}>
      <div style={{ display: "flex", gap: 26, height: "100%", opacity: out }}>
        <Panel kicker="Coding agent" title="Reads the repository" accent={MUTED}>
          <div style={{ position: "relative", marginTop: 34, borderRadius: 12, border: `1px solid ${LINE}`, padding: "18px 20px", background: "rgba(242,243,238,0.02)" }}>
            {CODE.map((line, index) => {
              const isSuspect = line.tone === "suspect";
              return (
                <div
                  key={line.text}
                  style={{
                    position: "relative",
                    fontFamily: FONT_MONO,
                    fontSize: 16,
                    lineHeight: "31px",
                    whiteSpace: "pre",
                    color: isSuspect && suspect > 0 ? CREAM : "rgba(242,243,238,0.55)",
                  }}
                >
                  <span style={{ display: "inline-block", width: 30, color: "rgba(242,243,238,0.22)" }}>{index + 1}</span>
                  {line.text}
                  {isSuspect ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: "0 -10px",
                        borderRadius: 6,
                        border: `1px dashed rgba(242,243,238,${0.55 * suspect})`,
                        background: `rgba(242,243,238,${0.05 * suspect})`,
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
            {/* Reading sweep */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 18 + (scan % 1) * 31 * CODE.length,
                height: 31,
                opacity: scan > 0 && scan < 2 ? 0.9 : 0,
                background: "linear-gradient(90deg, transparent, rgba(242,243,238,0.08), transparent)",
                borderTop: "1px solid rgba(242,243,238,0.18)",
              }}
            />
          </div>
          <div style={{ ...rise(suspect), marginTop: 18, fontFamily: FONT_HEADING, fontSize: 19, color: MUTED }}>
            &ldquo;Expiry looks unbounded. <span style={{ color: CREAM }}>Possibly exploitable.</span>&rdquo;
          </div>
          <Verdict label="Prediction" detail="Reasoned from source. Never executed." color="rgba(242,243,238,0.45)" value={leftVerdict} />
        </Panel>

        <Panel kicker="Vulnix" title="Tests the running app" accent={EMBER}>
          <div
            style={{
              ...rise(target),
              marginTop: 26,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid rgba(254,66,2,0.5)`,
              borderRadius: 999,
              padding: "8px 16px",
              fontFamily: FONT_MONO,
              fontSize: 15,
              color: CREAM,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: SUCCESS }} />
            app.example.com
            <span style={{ color: MUTED }}>· ownership verified</span>
          </div>

          <div style={{ position: "relative", marginTop: 18 }}>
            <div style={{ opacity: exploitPhase }}>
              <RequestRow method="POST" path="/api/v1/tokens  expires_at=9999" result="201 Created" ok={false} value={req[0]} />
              <RequestRow method="GET" path="/api/v1/scans  with that token" result="200 OK" ok={false} value={req[1]} />
              <RequestRow method="POST" path="/api/v1/tokens  (control)" result="90-day default" ok value={req[2]} />
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - exploitPhase }}>
              <div style={{ ...rise(fix, 10), padding: "11px 0", borderBottom: `1px solid ${LINE}`, fontFamily: FONT_MONO, fontSize: 15, color: MUTED }}>
                Fix deployed. Replaying the original exploit…
              </div>
              <RequestRow method="POST" path="/api/v1/tokens  expires_at=9999" result="422 Rejected" ok value={replay} />
            </div>
          </div>

          <Verdict
            label={fixed > 0 ? "Confirmed fixed" : "Proof"}
            detail={fixed > 0 ? "Same exploit, now blocked." : "Exploited on the live API. Evidence saved."}
            color={fixed > 0 ? SUCCESS : EMBER}
            value={Math.max(proof * exploitPhase, fixed)}
          />
        </Panel>
      </div>
    </AbsoluteFill>
  );
}
