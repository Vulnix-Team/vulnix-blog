import { Composition, Still, registerRoot } from "remotion";

import { CodingAgentVsVulnix, DURATION, FPS, HEIGHT, WIDTH } from "./CodingAgentVsVulnix";
import { COVER_H, COVER_W } from "./covers/stage";
import { AiPenetrationTestingCover } from "./covers/ai-penetration-testing";
import { AiPentestBrowserCover, AiPentestLoginCover, AiPentestShieldCover } from "./covers/ai-penetration-testing-options";
import { CodingAgentsCover } from "./covers/coding-agents";
import { ScanningCover } from "./covers/scanning";
import { ValidateFixCover } from "./covers/validate-fix";

function Root() {
  return (
    <>
      <Composition
        id="CodingAgentVsVulnix"
        component={CodingAgentVsVulnix}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Still id="AiPentestBrowserCover" component={AiPentestBrowserCover} width={COVER_W} height={COVER_H} />
      <Still id="AiPentestShieldCover" component={AiPentestShieldCover} width={COVER_W} height={COVER_H} />
      <Still id="AiPentestLoginCover" component={AiPentestLoginCover} width={COVER_W} height={COVER_H} />
      <Still id="AiPenetrationTestingCover" component={AiPenetrationTestingCover} width={COVER_W} height={COVER_H} />
      <Still id="CodingAgentsCover" component={CodingAgentsCover} width={COVER_W} height={COVER_H} />
      <Still id="ScanningCover" component={ScanningCover} width={COVER_W} height={COVER_H} />
      <Still id="ValidateFixCover" component={ValidateFixCover} width={COVER_W} height={COVER_H} />
    </>
  );
}

registerRoot(Root);
