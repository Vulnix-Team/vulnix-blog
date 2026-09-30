import { EMBER, INK } from "./brand";

// Dot, the Vulnix character: the Ember rounded square with two Ink eyes. The
// face is drawn in the icon's own 100-unit box with the website's exact eye
// shapes (product apps/web/components/marketing/agent-mark.tsx), so a cover
// shows the same character as vulnix.dev. Brand rule: pose it, never redraw it.

export type Mood = "neutral" | "happy" | "wink" | "squint" | "surprised";

const EYE = { fill: INK };
const LASH = { fill: "none", stroke: INK, strokeWidth: 7, strokeLinecap: "round" as const };

function Eyes({ mood }: { mood: Mood }) {
  const arc = (cx: number) => <path d={`M${cx - 8} 42 Q${cx} 29 ${cx + 8} 42`} {...LASH} />;
  const pill = (x: number) => <rect x={x} y="27" width="10" height="22" rx="5" {...EYE} />;
  switch (mood) {
    case "happy":
      return (
        <>
          {arc(30)}
          {arc(70)}
        </>
      );
    case "wink":
      return (
        <>
          {pill(25)}
          {arc(70)}
        </>
      );
    case "squint":
      return (
        <>
          <rect x="23" y="34" width="14" height="8" rx="4" {...EYE} />
          <rect x="63" y="34" width="14" height="8" rx="4" {...EYE} />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="30" cy="38" r="9" {...EYE} />
          <circle cx="70" cy="38" r="9" {...EYE} />
        </>
      );
    default:
      return (
        <>
          {pill(25)}
          {pill(65)}
        </>
      );
  }
}

/**
 * Dot centred on (x, y), `size` px square. `look` moves the eyes within the
 * website's reach (-1..1 maps to 9 units on x, 7 on y). `squash` < 1 flattens
 * it (landing), > 1 stretches it (leaping), keeping its area.
 */
export function Dot({
  x,
  y,
  size = 200,
  mood = "neutral",
  look = [0, 0],
  rotate = 0,
  squash = 1,
  fill = EMBER,
}: {
  x: number;
  y: number;
  size?: number;
  mood?: Mood;
  look?: [number, number];
  rotate?: number;
  squash?: number;
  fill?: string;
}) {
  const s = size / 100;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s / Math.sqrt(squash)} ${s * squash}) translate(-50 -50)`}>
      <rect width="100" height="100" rx="16" fill={fill} />
      <g transform={`translate(${look[0] * 9} ${look[1] * 7})`}>
        <Eyes mood={mood} />
      </g>
    </g>
  );
}
