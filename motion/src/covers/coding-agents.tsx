import { CREAM, EMBER, FONT_MONO, INK } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Stage } from "./stage";

// Cover for "Can Claude Code or Codex Replace a Pentest?". A friendly sparring
// match: a coding agent throws a jab, Dot hops clear of it with a wink, and a
// second agent holds up the round card. Nobody gets hurt; the article treats
// coding agents fairly, it just says what they can and can't prove.
//
// The coding agents are generic characters (two little robots, one with a
// terminal for a face), never any vendor's logo or mascot: the article is
// about the category, and someone else's character can't star in our ad.

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

function Limbs({
  x,
  top,
  w,
  h,
  base,
  arms,
  stance = 0,
}: {
  x: number;
  top: number;
  w: number;
  h: number;
  base: number;
  arms: [Arm, Arm];
  stance?: number;
}) {
  const shoulderY = top + h * 0.58;
  return (
    <g>
      {[-1, 1].map((side) => (
        <line key={side} x1={x + side * w * 0.22} y1={top + h - 6} x2={x + side * (w * 0.26 + stance)} y2={base} {...LIMB} />
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

/** Determined brows: a V over two eyes centred on (x +/- dx, y). */
function Brows({ x, y, dx, color }: { x: number; y: number; dx: number; color: string }) {
  return (
    <g stroke={color} strokeWidth={9} strokeLinecap="round">
      <line x1={x - dx - 22} y1={y - 36} x2={x - dx + 18} y2={y - 22} />
      <line x1={x + dx + 22} y1={y - 36} x2={x + dx - 18} y2={y - 22} />
    </g>
  );
}

/**
 * A coding agent as a black robot whose face is a terminal: antenna, a
 * screen with the window's three dots, two eyes, and a cursor for a mouth.
 */
function TerminalBot({
  x,
  w = 230,
  base = FLOOR,
  arms,
  lean = 0,
  stance = 0,
  fierce = false,
}: {
  x: number;
  w?: number;
  base?: number;
  arms: [Arm, Arm];
  lean?: number;
  stance?: number;
  fierce?: boolean;
}) {
  const h = w * 0.86;
  const top = base - 70 - h;
  const screen = { x: x - w / 2 + 24, y: top + 24, w: w - 48, h: h * 0.6 };
  const eyeY = screen.y + screen.h * 0.52;
  return (
    <g transform={`rotate(${lean} ${x} ${base})`}>
      <Limbs x={x} top={top} w={w} h={h} base={base} arms={arms} stance={stance} />
      <line x1={x} y1={top} x2={x} y2={top - 54} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={top - 62} r={16} fill={INK} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={34} fill={INK} />
      <rect x={screen.x} y={screen.y} width={screen.w} height={screen.h} rx={18} fill="#2b2b2b" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={screen.x + 14 + i * 18} cy={top + 12} r={5} fill={CREAM} opacity={0.5} />
      ))}
      {[-1, 1].map((sd) => (
        <rect key={sd} x={x + sd * 40 - 9} y={eyeY - 20} width={18} height={40} rx={9} fill={CREAM} />
      ))}
      {fierce ? <Brows x={x} y={eyeY - 16} dx={40} color={CREAM} /> : null}
      <rect x={x + 26} y={screen.y + screen.h - 30} width={34} height={10} rx={5} fill={CREAM} />
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
  stance = 0,
}: {
  x: number;
  w?: number;
  base?: number;
  happy?: boolean;
  arms: [Arm, Arm];
  lean?: number;
  stance?: number;
}) {
  const h = w * 0.86;
  const top = base - 70 - h;
  const eyeY = top + h * 0.45;
  return (
    <g transform={`rotate(${lean} ${x} ${base})`}>
      <Limbs x={x} top={top} w={w} h={h} base={base} arms={arms} stance={stance} />
      <line x1={x} y1={top} x2={x} y2={top - 54} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={top - 62} r={16} fill={BLUE} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={34} fill={BLUE} />
      <rect x={x - w / 2 + 26} y={top + 26} width={w - 52} height={h * 0.56} rx={20} fill={BLUE_SCREEN} />
      {happy ? (
        [-1, 1].map((sd) => (
          <path key={sd} d={`M ${x + sd * 38 - 16} ${eyeY + 6} Q ${x + sd * 38} ${eyeY - 18} ${x + sd * 38 + 16} ${eyeY + 6}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        ))
      ) : (
        [-1, 1].map((sd) => <circle key={sd} cx={x + sd * 38} cy={eyeY} r={14} fill={INK} />)
      )}
      <path d={`M ${x - 22} ${eyeY + 38} Q ${x} ${eyeY + 54} ${x + 22} ${eyeY + 38}`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
}

// A sparring ring. The terminal throws a jab, Dot hops clear of it with a
// wink. Gloves on, nobody hurt.

const RING = { left: 470, right: 1930, mat: FLOOR - 40 };
const ROPES = [RING.mat - 150, RING.mat - 270, RING.mat - 390];

export function CodingAgentsCover() {
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

      <ellipse cx={700} cy={RING.mat + 14} rx={100} ry={16} fill={INK} opacity={0.12} />
      <ellipse cx={1085} cy={RING.mat + 14} rx={120} ry={16} fill={INK} opacity={0.12} />
      {/* The other agent has its own job: the round card, held high in the
          corner. */}
      <RoboBot x={700} w={190} base={RING.mat} happy arms={[{ angle: -110, length: 180 }, { angle: -70, length: 180 }]} />
      <g transform="rotate(-4 700 560)">
        <rect x={550} y={485} width={300} height={150} rx={18} fill={CREAM} stroke={INK} strokeWidth={10} />
        <text x={700} y={582} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={64} fill={INK}>
          ROUND 1
        </text>
      </g>
      <TerminalBot
        x={1085}
        w={220}
        base={RING.mat}
        fierce
        lean={6}
        stance={20}
        arms={[{ angle: -115, length: 95, glove }, { angle: -8, length: 190, glove }]}
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
