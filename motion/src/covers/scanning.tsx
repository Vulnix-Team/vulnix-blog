import { CREAM, EMBER, FONT_HEADING, INK } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Shadow, Stage } from "./stage";

// Cover for "AI Penetration Testing vs. Vulnerability Scanning". The
// article's line: scanning gives coverage, adversarial testing supplies
// proof. Left, a scanner printing a long receipt of maybes. Right, Dot
// carrying one proven finding, winking at the pile.

const SCANNER = { x: 660, y: 650, w: 340 };
const RECEIPT = { x: 730, y: 150, w: 200 };
const ROWS = 9;
const DOT = { x: 1480, size: 230 };
const CARD = { w: 470, h: 300 };

function Scanner() {
  const { x, y, w } = SCANNER;
  const cx = x + w / 2;
  const cy = y + (FLOOR - y) / 2 + 20;
  return (
    <g>
      {/* The receipt, rising out of the slot */}
      <rect x={RECEIPT.x} y={RECEIPT.y} width={RECEIPT.w} height={y - RECEIPT.y + 10} rx={10} fill="#fffaf6" />
      {Array.from({ length: ROWS }, (_, i) => {
        const ry = RECEIPT.y + 44 + i * 50;
        return (
          <g key={i}>
            <rect x={RECEIPT.x + 24} y={ry - 13} width={24} height={24} rx={5} fill="none" stroke={INK} strokeOpacity={0.35} strokeWidth={4} />
            <rect x={RECEIPT.x + 62} y={ry - 5} width={70 - ((i * 23) % 30)} height={10} rx={5} fill={INK} fillOpacity={0.2} />
            <text x={RECEIPT.x + RECEIPT.w - 34} y={ry + 13} textAnchor="middle" fontFamily={FONT_HEADING} fontWeight={700} fontSize={38} fill={INK} fillOpacity={0.45}>
              ?
            </text>
          </g>
        );
      })}
      {/* The machine, with a radar face */}
      <rect x={x} y={y} width={w} height={FLOOR - y} rx={22} fill={INK} />
      <rect x={RECEIPT.x - 14} y={y + 22} width={RECEIPT.w + 28} height={12} rx={6} fill="#2b2b29" />
      <circle cx={cx} cy={cy} r={78} fill="none" stroke={CREAM} strokeOpacity={0.5} strokeWidth={5} />
      <circle cx={cx} cy={cy} r={42} fill="none" stroke={CREAM} strokeOpacity={0.3} strokeWidth={4} />
      <line x1={cx} y1={cy} x2={cx + 62} y2={cy - 46} stroke={CREAM} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

/** One proven finding: a check, the finding, and its evidence. */
function ProofCard({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-4)`}>
      <rect x={-CARD.w / 2 + 8} y={-CARD.h + 14} width={CARD.w} height={CARD.h} rx={26} fill={INK} opacity={0.12} />
      <rect x={-CARD.w / 2} y={-CARD.h} width={CARD.w} height={CARD.h} rx={26} fill="#fffaf6" />
      <circle cx={-CARD.w / 2 + 76} cy={-CARD.h + 76} r={40} fill={EMBER} />
      <path
        d={`M ${-CARD.w / 2 + 56} ${-CARD.h + 78} l 14 14 l 26 -30`}
        fill="none"
        stroke={CREAM}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x={-CARD.w / 2 + 140} y={-CARD.h + 56} width={250} height={16} rx={8} fill={INK} fillOpacity={0.8} />
      <rect x={-CARD.w / 2 + 140} y={-CARD.h + 88} width={170} height={12} rx={6} fill={INK} fillOpacity={0.3} />
      {/* Evidence: a request that got through */}
      <rect x={-CARD.w / 2 + 36} y={-CARD.h + 146} width={CARD.w - 72} height={118} rx={14} fill={INK} />
      <rect x={-CARD.w / 2 + 62} y={-CARD.h + 176} width={120} height={12} rx={6} fill={CREAM} fillOpacity={0.55} />
      <rect x={-CARD.w / 2 + 196} y={-CARD.h + 176} width={60} height={12} rx={6} fill={EMBER} />
      <rect x={-CARD.w / 2 + 62} y={-CARD.h + 210} width={220} height={12} rx={6} fill={CREAM} fillOpacity={0.3} />
      <rect x={-CARD.w / 2 + 62} y={-CARD.h + 234} width={150} height={12} rx={6} fill={CREAM} fillOpacity={0.3} />
    </g>
  );
}

export function ScanningCover() {
  const dotY = FLOOR - DOT.size / 2;
  return (
    <Stage tone="peach">
      <Scanner />
      <Shadow x={DOT.x} width={250} />
      <ProofCard x={DOT.x + 6} y={dotY - DOT.size / 2 + 4} />
      <Dot x={DOT.x} y={dotY} size={DOT.size} mood="wink" look={[-1, 0.1]} squash={0.96} />
    </Stage>
  );
}
