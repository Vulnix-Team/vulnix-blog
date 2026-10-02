import { CREAM, EMBER, FONT_MONO, INK, SUCCESS } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Shadow, Stage } from "./stage";

// Three simpler candidate covers for "What Is AI Penetration Testing?",
// built from icons anyone reads at a glance (a browser, a shield, a login).

const PAPER = "#fffdf8";
const GREY = "#d9dbd2";

function Tag({ x, y, text, fill = EMBER, rotate = 0 }: { x: number; y: number; text: string; fill?: string; rotate?: number }) {
  const w = text.length * 34 + 80;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={18} fill={fill} />
      <text x={0} y={18} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={50} fill={CREAM}>
        {text}
      </text>
    </g>
  );
}

/** A small ladybird-style bug, the universal "software bug" sign. */
function Bug({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((side) =>
        [-28, 0, 28].map((dy) => (
          <line key={`${side}${dy}`} x1={side * 30} y1={dy} x2={side * 66} y2={dy + (dy === 0 ? 0 : dy * 0.6)} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        )),
      )}
      <line x1={-14} y1={-52} x2={-30} y2={-82} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <line x1={14} y1={-52} x2={30} y2={-82} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <circle cx={0} cy={-46} r={22} fill={INK} />
      <ellipse cx={0} cy={6} rx={46} ry={56} fill={EMBER} />
      <line x1={0} y1={-46} x2={0} y2={60} stroke={INK} strokeWidth={6} />
      <circle cx={-20} cy={-6} r={9} fill={INK} />
      <circle cx={20} cy={22} r={9} fill={INK} />
    </g>
  );
}

// ── A: the browser and the bug ─────────────────────────────────────────

export function AiPentestBrowserCover() {
  const W = { x: 860, y: 230, w: 900, h: 650 };
  const lens = { x: 1430, y: 600, r: 150 };
  return (
    <Stage tone="cream">
      <Shadow x={W.x + W.w / 2} width={W.w - 100} />
      {/* The website */}
      <rect x={W.x} y={W.y} width={W.w} height={W.h} rx={30} fill={PAPER} stroke={INK} strokeWidth={14} />
      <line x1={W.x} y1={W.y + 86} x2={W.x + W.w} y2={W.y + 86} stroke={INK} strokeWidth={10} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={W.x + 50 + i * 40} cy={W.y + 44} r={12} fill={INK} />
      ))}
      <rect x={W.x + 200} y={W.y + 22} width={520} height={44} rx={22} fill={GREY} />
      <text x={W.x + 230} y={W.y + 54} fontFamily={FONT_MONO} fontSize={30} fill={INK} opacity={0.6}>
        your-app.com
      </text>
      <rect x={W.x + 60} y={W.y + 140} width={420} height={50} rx={12} fill={INK} opacity={0.85} />
      <rect x={W.x + 60} y={W.y + 220} width={600} height={24} rx={12} fill={GREY} />
      <rect x={W.x + 60} y={W.y + 266} width={520} height={24} rx={12} fill={GREY} />
      <rect x={W.x + 60} y={W.y + 340} width={240} height={240} rx={18} fill={GREY} />
      <rect x={W.x + 330} y={W.y + 340} width={240} height={240} rx={18} fill={GREY} />
      <rect x={W.x + 600} y={W.y + 340} width={240} height={240} rx={18} fill={GREY} />
      {/* The magnifier finds the bug */}
      <defs>
        <clipPath id="lensA">
          <circle cx={lens.x} cy={lens.y} r={lens.r} />
        </clipPath>
      </defs>
      <g clipPath="url(#lensA)">
        <circle cx={lens.x} cy={lens.y} r={lens.r} fill="#fff6ee" />
        <Bug x={lens.x} y={lens.y + 10} s={1.25} />
      </g>
      <circle cx={lens.x} cy={lens.y} r={lens.r} fill="none" stroke={INK} strokeWidth={24} />
      <line x1={lens.x + lens.r * 0.72} y1={lens.y + lens.r * 0.72} x2={lens.x + 300} y2={lens.y + 290} stroke={INK} strokeWidth={40} strokeLinecap="round" />
      <Tag x={lens.x - 10} y={lens.y - 230} text="PROVEN" rotate={-6} />
      <Shadow x={660} width={200} />
      <Dot x={660} y={FLOOR - 120} size={240} mood="happy" look={[1, -0.4]} rotate={-6} />
    </Stage>
  );
}

// ── B: the cracked shield ──────────────────────────────────────────────

export function AiPentestShieldCover() {
  const cx = 1300;
  const top = 170;
  const shield = `M ${cx} ${top} C ${cx + 180} ${top + 70} ${cx + 300} ${top + 70} ${cx + 360} ${top + 60} C ${cx + 360} ${top + 420} ${cx + 230} ${top + 640} ${cx} ${top + 770} C ${cx - 230} ${top + 640} ${cx - 360} ${top + 420} ${cx - 360} ${top + 60} C ${cx - 300} ${top + 70} ${cx - 180} ${top + 70} ${cx} ${top} Z`;
  const crack = `M ${cx + 20} ${top + 40} L ${cx - 30} ${top + 210} L ${cx + 50} ${top + 330} L ${cx - 20} ${top + 470} L ${cx + 30} ${top + 600}`;
  return (
    <Stage tone="cream">
      {/* Light through the crack, onto the floor */}
      <polygon points={`${cx - 40},${FLOOR} ${cx + 60},${FLOOR} ${cx + 300},1200 ${cx - 260},1200`} fill={EMBER} opacity={0.18} />
      <Shadow x={cx} width={600} />
      <path d={shield} fill={INK} />
      <path d={shield} fill="none" stroke="#2a2a2a" strokeWidth={30} transform={`translate(0 0)`} />
      <path d={crack} fill="none" stroke={EMBER} strokeWidth={30} strokeLinejoin="round" strokeLinecap="round" />
      <path d={crack} fill="none" stroke="#ffd2b8" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
      <Tag x={cx + 470} y={top + 260} text="FOUND" rotate={8} />
      <Shadow x={760} width={200} />
      <Dot x={760} y={FLOOR - 120} size={240} mood="surprised" look={[1, -0.6]} rotate={-8} />
    </Stage>
  );
}

// ── C: the login it got into ───────────────────────────────────────────

export function AiPentestLoginCover() {
  const F = { x: 1000, y: 300, w: 640, h: 600 };
  return (
    <Stage tone="cream">
      <Shadow x={F.x + F.w / 2} width={F.w - 60} />
      <rect x={F.x} y={F.y} width={F.w} height={F.h} rx={34} fill={PAPER} stroke={INK} strokeWidth={14} />
      {/* Open padlock icon at the top of the form */}
      <g transform={`translate(${F.x + F.w / 2} ${F.y + 110})`}>
        <path d="M -40 -6 L -40 -46 A 40 40 0 0 1 40 -46 L 40 -30" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" transform="rotate(-18 40 -6)" />
        <rect x={-58} y={-6} width={116} height={86} rx={16} fill={INK} />
        <circle cx={0} cy={34} r={12} fill={EMBER} />
      </g>
      {/* Username and password fields, and the button */}
      <rect x={F.x + 70} y={F.y + 240} width={F.w - 140} height={72} rx={14} fill="none" stroke={INK} strokeWidth={8} />
      <text x={F.x + 100} y={F.y + 288} fontFamily={FONT_MONO} fontSize={32} fill={INK} opacity={0.55}>
        admin
      </text>
      <rect x={F.x + 70} y={F.y + 340} width={F.w - 140} height={72} rx={14} fill="none" stroke={INK} strokeWidth={8} />
      <text x={F.x + 100} y={F.y + 390} fontFamily={FONT_MONO} fontSize={40} fill={INK} opacity={0.55}>
        ••••••••
      </text>
      <rect x={F.x + 70} y={F.y + 450} width={F.w - 140} height={84} rx={16} fill={INK} />
      <text x={F.x + F.w / 2} y={F.y + 504} textAnchor="middle" fontFamily={FONT_MONO} fontWeight={600} fontSize={34} fill={CREAM}>
        LOG IN
      </text>
      <Tag x={F.x + F.w / 2} y={F.y - 40} text="ACCESS GRANTED" fill={SUCCESS} rotate={-4} />
      <Shadow x={740} width={200} />
      <Dot x={740} y={FLOOR - 120} size={240} mood="wink" look={[1, -0.3]} rotate={-6} />
    </Stage>
  );
}
