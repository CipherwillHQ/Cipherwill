// Verifies the "How this works?" capsule button renders and wires CIPHERWILL_EXPLAINER to VideoPopup.
// Owns unit assertions for the capsule label, pill shape, and popup props.
// Does not open a browser or load YouTube iframes.
import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { CIPHERWILL_EXPLAINER } from "@/common/constant";
import type { VideoPopupProps } from "@/types/interfaces";

let capturedPopupProps: VideoPopupProps | null = null;

mock.module("../../../public/VideoPopup.tsx", {
  defaultExport: (props: VideoPopupProps) => {
    capturedPopupProps = props;
    return <div data-testid="video-popup" data-open={String(props.open)} />;
  },
});

test("renders How this works? capsule and configures VideoPopup with CIPHERWILL_EXPLAINER", async () => {
  const { default: HowThisWorksButton } = await import("./HowThisWorksButton");
  const html = renderToStaticMarkup(<HowThisWorksButton />);

  assert.match(html, /How this works\?/);
  assert.match(html, /rounded-full/);
  assert.equal(capturedPopupProps?.open, false);
  assert.equal(capturedPopupProps?.videoUrl, CIPHERWILL_EXPLAINER);
});
