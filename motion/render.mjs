// Renders the article visuals into ../public/illustrations:
//   coding-agent-vs-vulnix.webm   (muted VP9 loop)
//   covers/<slug>.webp            (article cover, 1600x800, for cards and the article)
//   covers/<slug>-og.png          (link preview, 1200x630, centre crop)
// Usage: npm run render            everything
//        npm run render -- covers  covers only
// (from blog/motion, after npm install)
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

const coversOnly = process.argv.includes("covers");

// Cover composition -> article slug. Each master is 2400x1200 (src/covers).
const COVERS = {
  CodingAgentsCover: "can-coding-agents-replace-a-pentest",
  ScanningCover: "ai-pentesting-vs-vulnerability-scanning",
  ValidateFixCover: "how-to-validate-a-security-fix",
};

if (!coversOnly) {
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
}

const coverDir = path.join(outDir, "covers");
mkdirSync(coverDir, { recursive: true });
for (const [id, slug] of Object.entries(COVERS)) {
  console.log(`Rendering cover ${slug}...`);
  const png = path.join(tmpDir, `${id}.png`);
  remotion(["still", "src/index.tsx", id, png]);
  const ffmpeg = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", png, ...args], { stdio: "inherit" });
  ffmpeg(["-vf", "scale=1600:800:flags=lanczos", "-c:v", "libwebp", "-quality", "90", path.join(coverDir, `${slug}.webp`)]);
  // 1200x630 is 1.905:1 - crop the 2:1 master's sides, keep its full height.
  ffmpeg(["-vf", "crop=2286:1200,scale=1200:630:flags=lanczos", path.join(coverDir, `${slug}-og.png`)]);
  rmSync(png, { force: true });
}

console.log(`Done: ${outDir}`);
