import { ParserResult, StepConfigParser } from '../models/StepConfigParser';
import { ParseableStepConfig } from '../guided-tour';
import { DOMUtils } from '../utils/DOMUtils';

export const ArrowParser = class extends StepConfigParser {
  constructor(stepConfig: ParseableStepConfig) {
    super(stepConfig);
  }

  override parse(): ParserResult {
    const elementOffset = DOMUtils.getDocumentOffset(this.stepConfig.element);
    const correctionTop = this.stepConfig.popupConfig.corrections.correctionTop;
    const correctionLeft = this.stepConfig.popupConfig.corrections.correctionLeft;
    const topCorner = elementOffset.top;
    const leftCorner = elementOffset.left;
    const bottomCorner = elementOffset.top + this.stepConfig.element.getBoundingClientRect().height;
    const rightCorner = elementOffset.left + this.stepConfig.element.getBoundingClientRect().width;

    const arrowSize = this.stepConfig.arrowConfig.arrowSize;
    const margin =
      this.stepConfig.popupConfig.margin + this.stepConfig.popupConfig.corrections.correctionMargin;

    let config: Record<string, string | number>;
    switch (this.stepConfig.position) {
      case 'TOP':
      case 'TOP_RIGHT':
      case 'TOP_LEFT': {
        config = {
          top: Math.floor(topCorner - margin + correctionTop),
          left: (rightCorner + leftCorner) / 2 - arrowSize,
          transform: 'rotate(180deg)',
        };
        break;
      }
      case 'BOTTOM':
      case 'BOTTOM_RIGHT':
      case 'BOTTOM_LEFT': {
        config = {
          top: Math.ceil(bottomCorner - arrowSize + margin + correctionTop),
          left: (leftCorner + rightCorner) / 2 - arrowSize,
        };
        break;
      }
      case 'RIGHT': {
        config = {
          top: (topCorner + bottomCorner - arrowSize) / 2,
          left: Math.ceil(rightCorner + margin + correctionLeft - 1.5 * arrowSize),
          transform: 'rotate(-90deg)',
        };
        break;
      }
      case 'LEFT': {
        config = {
          top: (topCorner + bottomCorner - arrowSize) / 2,
          left: Math.floor(leftCorner - margin + correctionLeft - arrowSize / 2),
          transform: 'rotate(90deg)',
        };
        break;
      }
      default: {
        config = {
          border: 0,
        };
      }
    }
    config = {
      borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
      ...config,
    };
    return {
      styleProps: DOMUtils.toPixel(config),
    };
  }
};
