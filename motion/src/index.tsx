import { Composition, Still, registerRoot } from "remotion";

import { CodingAgentVsVulnix, DURATION, FPS, HEIGHT, WIDTH } from "./CodingAgentVsVulnix";
import { COVER_HEIGHT, COVER_WIDTH, Cover } from "./Cover";
import { COVER_H, COVER_W, ValidateFixPaper, ValidateFixStage } from "./covers/validate-fix";

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
      <Still id="CodingAgentsCover" component={Cover} width={COVER_WIDTH} height={COVER_HEIGHT} />
      <Still id="ValidateFixStage" component={ValidateFixStage} width={COVER_W} height={COVER_H} />
      <Still id="ValidateFixPaper" component={ValidateFixPaper} width={COVER_W} height={COVER_H} />
    </>
  );
}

registerRoot(Root);
