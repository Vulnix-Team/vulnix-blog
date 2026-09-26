// Renders the article visuals into ../public/illustrations:
//   coding-agent-vs-vulnix.webm          (muted VP9 loop)
//   coding-agents-vs-pentest-cover.webp  (cover still)
// Usage: npm run render   (from blog/motion, after npm install)
//
// Scratch files go to RENDER_TMP (default: a folder beside the repo on the
// same drive) and concurrency is 1, so a render stays light on a machine that
// may be running other renders at the same time.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "..", "public", "illustrations");
const tmpDir = process.env.RENDER_TMP ?? path.resolve(here, "..", "..", ".render-tmp", "blog-article");
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

const env = { ...process.env, TEMP: tmpDir, TMP: tmpDir };
// `npx` needs a shell on Windows; quote every argument so paths with spaces
// (e.g. "Programming Projects") survive it intact.
const quote = (arg) => `"${String(arg).replace(/"/g, '\\"')}"`;
const remotion = (args) =>
  execFileSync("npx", ["remotion", ...args, "--concurrency=1"].map(quote), { cwd: here, stdio: "inherit", shell: true, env });

console.log("Rendering loop...");
const rawLoop = path.join(tmpDir, "loop-raw.webm");
remotion(["render", "src/index.tsx", "CodingAgentVsVulnix", rawLoop, "--codec=vp9", "--crf=34", "--muted"]);

// Remotion's VP9 output is tagged full-range ("pc") colour. Chrome's decoder
// rejects that stream with PIPELINE_ERROR_DECODE after the first frame, even
// though ffmpeg decodes it fine - so convert to standard TV range before
// publishing. Verified in Chromium 2026-09-26.
console.log("Converting loop to TV-range VP9...");
execFileSync(
  "ffmpeg",
  [
    "-y", "-loglevel", "error", "-i", rawLoop,
    "-vf", "scale=in_range=pc:out_range=tv,format=yuv420p",
    "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-g", "60", "-an",
    path.join(outDir, "coding-agent-vs-vulnix.webm"),
  ],
  { stdio: "inherit" },
);
rmSync(rawLoop, { force: true });

console.log("Rendering cover...");
const coverPng = path.join(tmpDir, "cover.png");
remotion(["still", "src/index.tsx", "CodingAgentsCover", coverPng]);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", coverPng, "-c:v", "libwebp", "-quality", "88", path.join(outDir, "coding-agents-vs-pentest-cover.webp")], {
  stdio: "inherit",
});
rmSync(coverPng, { force: true });

console.log(`Done: ${outDir}`);
