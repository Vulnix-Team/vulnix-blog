import { AbsoluteFill } from "remotion";

import { CREAM, DOT_GRID, EMBER } from "./brand";

// Cover for "Can Claude Code or Codex Replace a Pentest?". Left: stacked,
// dim code sheets (the repository a coding agent reads). Right: a glowing
// running system with ember attack paths that reach it, one of them marked
// as proven. Matches the abstract, text-free style of the other covers.
export const COVER_WIDTH = 1672;
export const COVER_HEIGHT = 941;

const SHEETS = [0, 1, 2];
const PATHS = [
  "M 820 470 C 950 470, 1000 250, 1180 250 L 1300 250",
  "M 820 470 C 980 470, 1020 380, 1150 380 L 1240 380",
  "M 820 470 L 1180 470",
  "M 820 470 C 980 470, 1020 570, 1150 570 L 1240 570",
  "M 820 470 C 950 470, 1000 690, 1180 690 L 1300 690",
];

export function Cover() {
  return (
    <AbsoluteFill style={DOT_GRID}>
      <svg width={COVER_WIDTH} height={COVER_HEIGHT} viewBox={`0 0 ${COVER_WIDTH} ${COVER_HEIGHT}`}>
        <defs>
          {/* userSpaceOnUse: a straight horizontal path has a zero-height bounding
              box, so a box-relative filter or gradient would render nothing. */}
          <filter id="glow" filterUnits="userSpaceOnUse" x={-COVER_WIDTH} y={-COVER_HEIGHT} width={COVER_WIDTH * 3} height={COVER_HEIGHT * 3}>
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb08a" />
            <stop offset="45%" stopColor={EMBER} />
            <stop offset="100%" stopColor={EMBER} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="640" y1="0" x2="790" y2="0">
            <stop offset="0%" stopColor={CREAM} stopOpacity="0.05" />
            <stop offset="100%" stopColor={CREAM} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Repository: stacked code sheets, read but never run */}
        {SHEETS.map((index) => {
          const x = 150 + index * 150;
          const y = 190 + index * 40;
          return (
            <g key={index} opacity={0.35 + index * 0.2} transform={`translate(${x} ${y}) skewY(-12)`}>
              <rect width="250" height="470" rx="10" fill="rgba(242,243,238,0.02)" stroke={CREAM} strokeOpacity="0.3" />
              {Array.from({ length: 14 }, (_, line) => (
                <rect
                  key={line}
                  x={26 + (line % 3) * 16}
                  y={34 + line * 30}
                  width={190 - ((line * 37) % 90) - (line % 3) * 16}
                  height="5"
                  rx="2.5"
                  fill={CREAM}
                  fillOpacity={line === 6 && index === 2 ? 0.75 : 0.22}
                />
              ))}
            </g>
          );
        })}

        {/* The gap between reading and running */}
        <line x1="820" y1="120" x2="820" y2="820" stroke={CREAM} strokeOpacity="0.12" strokeDasharray="3 9" />
        <path d="M 640 470 L 790 470" stroke="url(#fade)" strokeWidth="2" strokeDasharray="6 8" />

        {/* Attack paths into the running system */}
        {PATHS.map((d, index) => (
          <path key={d} d={d} fill="none" stroke={EMBER} strokeWidth={index === 2 ? 3 : 2} strokeOpacity={index === 2 ? 1 : 0.55} filter="url(#glow)" />
        ))}
        {[
          [1300, 250],
          [1240, 380],
          [1240, 570],
          [1300, 690],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill={EMBER} filter="url(#glow)" />
        ))}

        {/* Running system */}
        <g filter="url(#glow)">
          <circle cx="1330" cy="470" r="150" fill="none" stroke={EMBER} strokeOpacity="0.25" strokeDasharray="2 10" />
          <circle cx="1330" cy="470" r="104" fill="none" stroke={EMBER} strokeOpacity="0.55" />
          <circle cx="1330" cy="470" r="62" fill="url(#core)" />
        </g>
        <path d="M 1180 470 L 1268 470" stroke={EMBER} strokeWidth="3" filter="url(#glow)" />

        {/* Proof marker on the main path */}
        <g transform="translate(1010 470)" filter="url(#glow)">
          <rect x="-30" y="-30" width="60" height="60" rx="8" transform="rotate(45)" fill="#0a0c0b" stroke={EMBER} strokeWidth="2" />
          <path d="M -12 1 L -3 10 L 13 -9" fill="none" stroke={CREAM} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
}
