import { ParserResult, StepConfigParser } from '../models/StepConfigParser';
import { ParseableStepConfig } from '../guided-tour';
import { DOMUtils } from '../utils/DOMUtils';

export const SpotlightParser = class extends StepConfigParser {
  constructor(stepConfig: ParseableStepConfig) {
    super(stepConfig);
  }

  override parse(): ParserResult {
    const elementOffset = DOMUtils.getDocumentOffset(this.stepConfig.element);
    const correctionTop = this.stepConfig.spotlightConfig.corrections.correctionTop;
    const correctionLeft = this.stepConfig.spotlightConfig.corrections.correctionLeft;
    const top = elementOffset.top + correctionTop - this.stepConfig.spotlightConfig.padding;
    const left = elementOffset.left + correctionLeft - this.stepConfig.spotlightConfig.padding;

    const correctionHeight =
      this.stepConfig.spotlightConfig.corrections.correctionHeight +
      this.stepConfig.spotlightConfig.padding * 2;
    const correctionWidth =
      this.stepConfig.spotlightConfig.corrections.correctionWidth +
      this.stepConfig.spotlightConfig.padding * 2;

    const height = this.stepConfig.element.getBoundingClientRect().height + correctionHeight;
    const width = this.stepConfig.element.getBoundingClientRect().width + correctionWidth;

    const styleProps = DOMUtils.toPixel({
      top,
      left,
      height,
      width,
    });

    return {
      styleProps,
    };
  }
};
