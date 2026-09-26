import { Composition, Still, registerRoot } from "remotion";

import { CodingAgentVsVulnix, DURATION, FPS, HEIGHT, WIDTH } from "./CodingAgentVsVulnix";
import { COVER_HEIGHT, COVER_WIDTH, Cover } from "./Cover";

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
    </>
  );
}

registerRoot(Root);
