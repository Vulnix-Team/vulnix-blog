import { CREAM, EMBER, FONT_MONO, INK, SUCCESS } from "../brand";
import { Dot } from "../dot";
import { FLOOR, Shadow, Stage } from "./stage";

// Cover for "What Is AI Penetration Testing?". The plainest picture of what
// an AI pentest proves: a login form it got through. An open padlock on the
// form, ACCESS GRANTED above it, and Dot beside it with a wink. Chosen
// 2026-10-02 over a padlock-only scene as easier to read at a glance.

const PAPER = "#fffdf8";

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


export function AiPenetrationTestingCover() {
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
