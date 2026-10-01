import type { ReactNode } from "react";

import { CREAM, EMBER, FONT_MONO, INK, SUCCESS } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Shadow, Stage } from "./stage";

// Three candidate covers for "Can Claude Code or Codex Replace a Pentest?",
// for choosing between. The coding agents are generic characters (a terminal
// window and a little robot), never any vendor's logo or mascot: the article
// is about the category, and someone else's character can't star in our ad.

const BLUE = "#4f63d2";
const BLUE_SCREEN = "#dfe4ff";
const LIMB = { stroke: INK, strokeWidth: 16, strokeLinecap: "round" as const, fill: "none" };

type Arm = { angle: number; length?: number; glove?: string };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** A boxing glove at the hand, pointing along the arm. */
function Glove({ x, y, angle, fill }: { x: number; y: number; angle: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-22} y={-24} width={22} height={48} rx={8} fill={CREAM} />
      <rect x={-6} y={-36} width={84} height={72} rx={34} fill={fill} />
      <rect x={6} y={-44} width={40} height={30} rx={15} fill={fill} />
    </g>
  );
}

function Limbs({ x, top, w, h, base, arms }: { x: number; top: number; w: number; h: number; base: number; arms: [Arm, Arm] }) {
  const shoulderY = top + h * 0.58;
  return (
    <g>
      {[-1, 1].map((side) => (
        <line key={side} x1={x + side * w * 0.22} y1={top + h - 6} x2={x + side * w * 0.26} y2={base} {...LIMB} />
      ))}
      {arms.map((arm, i) => {
        const side = i === 0 ? -1 : 1;
        const sx = x + side * (w / 2 - 6);
        const length = arm.length ?? w * 0.42;
        const hx = sx + Math.cos(rad(arm.angle)) * length;
        const hy = shoulderY + Math.sin(rad(arm.angle)) * length;
        return (
          <g key={i}>
            <line x1={sx} y1={shoulderY} x2={hx} y2={hy} {...LIMB} />
            {arm.glove ? <Glove x={hx} y={hy} angle={arm.angle} fill={arm.glove} /> : <circle cx={hx} cy={hy} r={15} fill={INK} />}
          </g>
        );
      })}
    </g>
  );
}

/** A coding agent as a terminal window: title-bar dots and a prompt for a face. */
function TerminalBot({
  x,
  w = 240,
  base = FLOOR,
  face = ">_",
  arms,
  lean = 0,
}: {
  x: number;
  w?: number;
  base?: number;
  face?: string;
  arms: [Arm, Arm];
  lean?: number;
}) {
  const h = w * 0.78;
  const top = base - 70 - h;
  return (
    <g transform={`rotate(${lean} ${x} ${base})`}>
      <Limbs x={x} top={top} w={w} h={h} base={base} arms={arms} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={24} fill={INK} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x - w / 2 + 30 + i * 26} cy={top + 28} r={8} fill={CREAM} opacity={0.45} />
      ))}
      <line x1={x - w / 2} y1={top + 54} x2={x + w / 2} y2={top + 54} stroke={CREAM} strokeOpacity={0.15} strokeWidth={3} />
      <text x={x} y={top + h * 0.72} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={w * 0.34} fill={CREAM}>
        {face}
      </text>
    </g>
  );
}

/** A coding agent as a little robot: antenna, screen face, round eyes. */
function RoboBot({
  x,
  w = 210,
  base = FLOOR,
  happy = false,
  arms,
  lean = 0,
}: {
  x: number;
  w?: number;
  base?: number;
  happy?: boolean;
  arms: [Arm, Arm];
  lean?: number;
}) {
  const h = w * 0.86;
  const top = base - 70 - h;
  const eyeY = top + h * 0.45;
  return (
    <g transform={`rotate(${lean} ${x} ${base})`}>
      <Limbs x={x} top={top} w={w} h={h} base={base} arms={arms} />
      <line x1={x} y1={top} x2={x} y2={top - 54} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={top - 62} r={16} fill={BLUE} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={34} fill={BLUE} />
      <rect x={x - w / 2 + 26} y={top + 26} width={w - 52} height={h * 0.56} rx={20} fill={BLUE_SCREEN} />
      {happy ? (
        [-1, 1].map((s) => (
          <path key={s} d={`M ${x + s * 38 - 16} ${eyeY + 6} Q ${x + s * 38} ${eyeY - 18} ${x + s * 38 + 16} ${eyeY + 6}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        ))
      ) : (
        [-1, 1].map((s) => <circle key={s} cx={x + s * 38} cy={eyeY} r={14} fill={INK} />)
      )}
      <path d={`M ${x - 22} ${eyeY + 38} Q ${x} ${eyeY + 54} ${x + 22} ${eyeY + 38}`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
}

function Bubble({ x, y, text, tail = "left" }: { x: number; y: number; text: string; tail?: "left" | "right" }) {
  const w = text.length * 46 + 70;
  const tx = tail === "left" ? x - w / 2 + 50 : x + w / 2 - 50;
  return (
    <g>
      <rect x={x - w / 2} y={y - 50} width={w} height={100} rx={28} fill={CREAM} />
      <path d={`M ${tx - 18} ${y + 46} L ${tx - 24} ${y + 92} L ${tx + 22} ${y + 46} Z`} fill={CREAM} />
      <text x={x} y={y + 22} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={64} fill={INK}>
        {text}
      </text>
    </g>
  );
}

/** Code lines as rounded bars. `hot` is the index drawn in Ember. */
function CodeLines({ x, y, widths, gap = 46, hot, bar = 18, color = INK }: { x: number; y: number; widths: number[]; gap?: number; hot?: number; bar?: number; color?: string }) {
  return (
    <g>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={x + (i % 3 === 1 ? 40 : 0)}
          y={y + i * gap}
          width={w}
          height={bar}
          rx={bar / 2}
          fill={i === hot ? EMBER : color}
          opacity={i === hot ? 1 : 0.28}
        />
      ))}
    </g>
  );
}

function Check({ x, y, r = 46 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={SUCCESS} />
      <path d={`M ${x - r * 0.42} ${y + 2} L ${x - r * 0.1} ${y + r * 0.34} L ${x + r * 0.45} ${y - r * 0.3}`} fill="none" stroke="#fff" strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// ── Option 1: the inspector ─────────────────────────────────────────────
// The coding agents present their code, approved ("LGTM", green check). Dot
// holds a magnifying glass to it and finds the line that still breaks.

const SHEET = { x: 1080, y: 250, w: 390, h: 500 };
const LENS = { x: 1350, y: 560, r: 128 };
const SHEET_LINES = [250, 300, 190, 270, 220, 120, 260, 200];

export function CodingAgentsInspectorCover() {
  return (
    <Stage tone="oat">
      <Shadow x={560} width={230} />
      <Shadow x={870} width={200} />
      <TerminalBot x={560} w={230} arms={[{ angle: 140 }, { angle: -50, length: 110 }]} />
      <RoboBot x={870} w={200} happy arms={[{ angle: 140 }, { angle: -20, length: 130 }]} />
      <Bubble x={600} y={590} text="LGTM" />

      {/* The approved code, on a stand */}
      <line x1={SHEET.x + SHEET.w / 2} y1={SHEET.y + SHEET.h} x2={SHEET.x + SHEET.w / 2} y2={FLOOR} stroke={INK} strokeWidth={16} />
      <line x1={SHEET.x + SHEET.w / 2 - 90} y1={FLOOR} x2={SHEET.x + SHEET.w / 2 + 90} y2={FLOOR} stroke={INK} strokeWidth={16} strokeLinecap="round" />
      <rect x={SHEET.x} y={SHEET.y} width={SHEET.w} height={SHEET.h} rx={20} fill={CREAM} stroke={INK} strokeWidth={12} />
      <CodeLines x={SHEET.x + 44} y={SHEET.y + 70} widths={SHEET_LINES} gap={50} />
      <Check x={SHEET.x + SHEET.w - 10} y={SHEET.y + 14} />

      {/* The lens: the same code, magnified, with the line that still breaks */}
      <defs>
        <clipPath id="lens">
          <circle cx={LENS.x} cy={LENS.y} r={LENS.r} />
        </clipPath>
      </defs>
      <g clipPath="url(#lens)">
        <circle cx={LENS.x} cy={LENS.y} r={LENS.r} fill="#fffaf2" />
        <CodeLines x={LENS.x - 120} y={LENS.y - 96} widths={[200, 150, 230, 120]} gap={64} hot={2} bar={30} />
      </g>
      <circle cx={LENS.x} cy={LENS.y} r={LENS.r} fill="none" stroke={INK} strokeWidth={22} />
      <line x1={LENS.x + LENS.r * 0.72} y1={LENS.y + LENS.r * 0.72} x2={LENS.x + 250} y2={LENS.y + 230} stroke={INK} strokeWidth={34} strokeLinecap="round" />

      <Shadow x={1700} width={210} />
      <Dot x={1700} y={FLOOR - 125} size={250} mood="squint" look={[-1, -0.4]} rotate={-6} />
    </Stage>
  );
}

// ── Option 2: the wall ──────────────────────────────────────────────────
// The coding agents build a wall of code, fast. Dot taps it and one brick
// slides out, with the gap behind it lit in Ember.

const WALL = { x: 1020, w: 480, rows: 5, brickH: 84, brickW: 160 };
const WALL_TOP = FLOOR - WALL.rows * WALL.brickH;
const LOOSE = { row: 2, col: 2 }; // counted from the bottom row, left column

function Brick({ x, y, w, h, fill = CREAM }: { x: number; y: number; w: number; h: number; fill?: string }) {
  return (
    <g>
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={10} fill={fill} stroke={INK} strokeWidth={6} />
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={38} fill={INK} opacity={0.35}>
        {"{ }"}
      </text>
    </g>
  );
}

export function CodingAgentsWallCover() {
  const bricks: ReactNode[] = [];
  let loose: { x: number; y: number; w: number } | null = null;
  for (let row = 0; row < WALL.rows; row++) {
    const y = FLOOR - (row + 1) * WALL.brickH;
    const offset = row % 2 ? -WALL.brickW / 2 : 0;
    for (let x = WALL.x + offset, col = 0; x < WALL.x + WALL.w; x += WALL.brickW, col++) {
      const bx = Math.max(x, WALL.x);
      const bw = Math.min(x + WALL.brickW, WALL.x + WALL.w) - bx;
      if (row === LOOSE.row && col === LOOSE.col) {
        loose = { x: bx, y, w: bw };
        continue;
      }
      // The top row is half built: the robot is still placing it.
      if (row === WALL.rows - 1 && col > 0) continue;
      bricks.push(<Brick key={`${row}-${col}`} x={bx} y={y} w={bw} h={WALL.brickH} />);
    }
  }
  const l = loose!;
  return (
    <Stage tone="sage">
      <Shadow x={640} width={230} />
      <TerminalBot x={640} w={230} face=">_" arms={[{ angle: -105, length: 150 }, { angle: -75, length: 150 }]} />
      {/* A brick on its way to the wall, carried overhead */}
      <Brick x={640 - 130} y={FLOOR - 70 - 230 * 0.78 - WALL.brickH - 6} w={260} h={WALL.brickH} />

      {bricks}
      {/* The hole the loose brick leaves, lit in Ember */}
      <rect x={l.x + 4} y={l.y + 4} width={l.w - 8} height={WALL.brickH - 8} rx={10} fill={EMBER} />
      <g transform={`translate(${l.x + 120} ${l.y + 24}) rotate(16 ${l.w / 2} ${WALL.brickH / 2})`}>
        <Brick x={0} y={0} w={l.w} h={WALL.brickH} />
      </g>

      {/* The robot on top, placing the last bricks */}
      <RoboBot x={WALL.x + 240} w={180} base={WALL_TOP + WALL.brickH} happy arms={[{ angle: -150, length: 100 }, { angle: 10, length: 110 }]} />
      <Brick x={WALL.x + 360} y={WALL_TOP - 40} w={WALL.brickW} h={WALL.brickH} />

      {/* Dot's tap */}
      {[-30, 0, 30].map((a) => {
        const r = rad(a);
        const cx = WALL.x + WALL.w + 150;
        const cy = l.y - 70;
        return <line key={a} x1={cx + Math.cos(r) * 40} y1={cy + Math.sin(r) * 40} x2={cx + Math.cos(r) * 86} y2={cy + Math.sin(r) * 86} stroke={INK} strokeWidth={9} strokeLinecap="round" opacity={0.5} />;
      })}
      <Shadow x={1800} width={210} />
      <Dot x={1800} y={FLOOR - 125} size={250} mood="surprised" look={[-1, -0.2]} rotate={-10} />
    </Stage>
  );
}

// ── Option 3: friendly sparring ─────────────────────────────────────────
// A sparring ring. The terminal throws a jab, Dot hops clear of it with a
// wink. Gloves on, nobody hurt.

const RING = { left: 470, right: 1930, mat: FLOOR - 40 };
const ROPES = [RING.mat - 150, RING.mat - 270, RING.mat - 390];

export function CodingAgentsSparringCover() {
  const glove = "#c8361a";
  return (
    <Stage tone="oat">
      {/* The ring: mat, corner posts, ropes */}
      <rect x={RING.left - 30} y={RING.mat} width={RING.right - RING.left + 60} height={FLOOR - RING.mat + 60} fill={CREAM} />
      <rect x={RING.left - 30} y={RING.mat} width={RING.right - RING.left + 60} height={18} fill={INK} opacity={0.12} />
      {ROPES.map((y, i) => (
        <line key={y} x1={RING.left} y1={y} x2={RING.right} y2={y} stroke={i === 1 ? EMBER : CREAM} strokeWidth={14} strokeLinecap="round" />
      ))}
      {[RING.left, RING.right].map((x) => (
        <rect key={x} x={x - 22} y={ROPES[2] - 40} width={44} height={RING.mat - ROPES[2] + 40} rx={10} fill={INK} />
      ))}

      <Shadow x={900} width={200} />
      <RoboBot x={760} w={190} base={RING.mat} happy arms={[{ angle: -110, length: 90, glove: BLUE }, { angle: -70, length: 90, glove: BLUE }]} />
      <TerminalBot
        x={1060}
        w={230}
        base={RING.mat}
        lean={6}
        arms={[{ angle: -100, length: 80, glove }, { angle: -8, length: 190, glove }]}
      />
      {/* The jab's swish, and where Dot used to be */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={1260 + i * 10} y1={RING.mat - 230 + i * 40} x2={1340 + i * 10} y2={RING.mat - 230 + i * 40} stroke={INK} strokeWidth={9} strokeLinecap="round" opacity={0.35} />
      ))}
      {[-40, 0, 40].map((a) => {
        const r = rad(a);
        return <line key={a} x1={1500 + Math.cos(r) * 36} y1={RING.mat - 236 + Math.sin(r) * 36} x2={1500 + Math.cos(r) * 70} y2={RING.mat - 236 + Math.sin(r) * 70} stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={0.35} />;
      })}

      <ellipse cx={1660} cy={RING.mat + 14} rx={90} ry={16} fill={INK} opacity={0.1} />
      <Glove x={1530} y={RING.mat - 300} angle={200} fill={INK} />
      <Glove x={1800} y={RING.mat - 250} angle={-20} fill={INK} />
      <Dot x={1665} y={RING.mat - 330} size={230} mood="wink" look={[-0.8, 0.3]} rotate={-8} squash={1.05} />
    </Stage>
  );
}
