import { CREAM, EMBER, INK } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Shadow, Stage } from "./stage";

// Cover for "Can Claude Code or Codex Replace a Pentest?". The article's line:
// coding agents read the blueprint, a pentest tries the doors. Left, the
// blueprint on an easel, its door marked in Ember. Right, the real door,
// open onto light, and Dot walking up to try it.

const BOARD = { x: 500, y: 300, w: 470, h: 350 };
const DOOR = { x: 1520, y: 360, w: 280 };
const DOT = { x: 1300, size: 220 };
const PLAN_LINE = { stroke: CREAM, strokeOpacity: 0.8, strokeWidth: 6, strokeLinecap: "round" as const, fill: "none" };

function Blueprint() {
  const { x, y, w, h } = BOARD;
  const l = x + 44;
  const t = y + 44;
  const r = x + w - 44;
  const b = y + h - 44;
  return (
    <g>
      {/* Easel */}
      {[
        [x + 90, FLOOR],
        [x + w - 90, FLOOR],
      ].map(([fx, fy]) => (
        <line key={fx} x1={x + w / 2} y1={y + h - 20} x2={fx} y2={fy} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      ))}
      <rect x={x} y={y} width={w} height={h} rx={16} fill={INK} />
      {/* A floor plan: rooms, a window, and the door (in Ember) */}
      <path d={`M ${r} ${b - 90} L ${r} ${t} L ${l} ${t} L ${l} ${b} L ${r} ${b} L ${r} ${b - 30}`} {...PLAN_LINE} />
      <path d={`M ${l + 200} ${t} L ${l + 200} ${t + 130}`} {...PLAN_LINE} />
      <path d={`M ${l} ${t + 150} L ${l + 130} ${t + 150}`} {...PLAN_LINE} />
      <path d={`M ${l + 60} ${t} L ${l + 140} ${t}`} stroke={INK} strokeWidth={10} />
      <path d={`M ${l + 60} ${t - 8} L ${l + 140} ${t - 8} M ${l + 60} ${t + 8} L ${l + 140} ${t + 8}`} {...PLAN_LINE} strokeWidth={4} />
      <path d={`M ${r} ${b - 30} L ${r - 60} ${b - 30}`} stroke={EMBER} strokeWidth={6} strokeLinecap="round" />
      <path d={`M ${r - 60} ${b - 30} A 60 60 0 0 1 ${r} ${b - 90}`} fill="none" stroke={EMBER} strokeWidth={5} strokeDasharray="4 10" strokeLinecap="round" />
    </g>
  );
}

function RealDoor() {
  const { x, y, w } = DOOR;
  return (
    <g>
      {/* Light from the running system, spilling onto the floor */}
      <polygon points={`${x},${FLOOR} ${x + w},${FLOOR} ${x + w - 60},1200 ${x - 330},1200`} fill="#fff6ee" opacity={0.7} />
      <rect x={x} y={y} width={w} height={FLOOR - y} fill="#fff6ee" />
      <rect x={x} y={y} width={w} height={FLOOR - y} fill="none" stroke={INK} strokeWidth={22} strokeLinejoin="round" />
      {/* The door leaf, swung open toward us */}
      <polygon points={`${x + w + 11},${y - 11} ${x + w + 110},${y - 50} ${x + w + 110},${FLOOR + 26} ${x + w + 11},${FLOOR}`} fill={INK} />
      <circle cx={x + w + 88} cy={(y + FLOOR) / 2 + 20} r={11} fill={CREAM} />
    </g>
  );
}

export function CodingAgentsCover() {
  const planDoor = [BOARD.x + BOARD.w - 74, BOARD.y + BOARD.h - 80];
  return (
    <Stage tone="oat">
      <Blueprint />
      <RealDoor />
      {/* The plan's door, and the real one */}
      <path
        d={`M ${planDoor[0] + 30} ${planDoor[1] - 20} Q ${(planDoor[0] + DOOR.x) / 2} ${BOARD.y - 60} ${DOOR.x - 40} ${DOOR.y + 120}`}
        fill="none"
        stroke={INK}
        strokeOpacity={0.35}
        strokeWidth={8}
        strokeDasharray="2 26"
        strokeLinecap="round"
      />
      <Shadow x={DOT.x + 10} width={190} />
      {/* Mid-hop toward the door */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={DOT.x - DOT.size / 2 - 40 - i * 14}
          y1={FLOOR - DOT.size / 2 - 110 + i * 56}
          x2={DOT.x - DOT.size / 2 - 120 - i * 14}
          y2={FLOOR - DOT.size / 2 - 110 + i * 56}
          stroke={INK}
          strokeOpacity={0.35}
          strokeWidth={9}
          strokeLinecap="round"
        />
      ))}
      <Dot x={DOT.x} y={FLOOR - DOT.size / 2 - 70} size={DOT.size} mood="squint" look={[1, -0.3]} rotate={8} squash={1.06} />
    </Stage>
  );
}
