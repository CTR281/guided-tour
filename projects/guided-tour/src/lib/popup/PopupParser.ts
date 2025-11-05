import { ParseableStepConfig, POSITIONS } from '../guided-tour';
import { DOMUtils } from '../utils/DOMUtils';
import { ParserResult, StepConfigParser } from '../models/StepConfigParser';
import { GuidedTourPosition } from '../guided-tour.types';

export interface PopupParserResult extends ParserResult {
  truePosition: GuidedTourPosition;
  scrollOffset: { top: number; left: number };
}

export const PopupParser = class extends StepConfigParser {
  elementOffset: { top: number; left: number; bottom: number; right: number };
  correctionTop: number;
  correctionLeft: number;
  arrowSize: number;
  margin: number;
  minHeight: number;
  minWidth: number;
  maxHeight: number;
  maxWidth: number;

  constructor(
    stepConfig: ParseableStepConfig,
    public height: number,
    public width: number,
    public centerCoords: { top: number; left: number },
  ) {
    super(stepConfig);
    this.elementOffset = {
      ...DOMUtils.getDocumentOffset(this.stepConfig.element),
      bottom: 0,
      right: 0,
    };
    this.elementOffset.right =
      this.elementOffset.left + this.stepConfig.element.getBoundingClientRect().width;
    this.elementOffset.bottom =
      this.elementOffset.top + this.stepConfig.element.getBoundingClientRect().height;
    this.correctionTop = this.stepConfig.popupConfig.corrections.correctionTop;
    this.correctionLeft = this.stepConfig.popupConfig.corrections.correctionLeft;
    this.arrowSize = this.stepConfig.arrowConfig.arrowSize;
    this.margin =
      this.stepConfig.popupConfig.margin + this.stepConfig.popupConfig.corrections.correctionMargin;
    this.minHeight = DOMUtils.pixelToNum(this.stepConfig.popupConfig.styleProps.minHeight);
    this.minWidth = DOMUtils.pixelToNum(this.stepConfig.popupConfig.styleProps.minWidth);
    this.maxHeight = DOMUtils.pixelToNum(this.stepConfig.popupConfig.styleProps.maxHeight);
    this.maxWidth = DOMUtils.pixelToNum(this.stepConfig.popupConfig.styleProps.maxWidth);
  }

  parse(): PopupParserResult {
    return this._parsePosition();
  }

  /**
   * Calculate the popup's offset based on the user-input position.
   *
   * If this position is not possible, it will test other positions recursively until one works.
   * @param position
   * @param positionsParsed
   * @param forcePosition
   */
  _parsePosition(
    position: GuidedTourPosition = this.stepConfig.position,
    positionsParsed = 0,
    forcePosition = this.stepConfig.forcePosition,
  ): PopupParserResult {
    let top, left;
    switch (position) {
      case 'TOP': {
        top = Math.ceil(this.elementOffset.top + this.correctionTop - this.height - this.margin);
        left =
          (this.elementOffset.left + this.elementOffset.right - this.width) / 2 +
          this.correctionLeft;
        break;
      }
      case 'TOP_RIGHT': {
        top = Math.ceil(this.elementOffset.top + this.correctionTop - this.height - this.margin);
        left =
          (this.elementOffset.left + this.elementOffset.right) / 2 -
          this.arrowSize * 2 +
          this.correctionLeft;
        break;
      }
      case 'RIGHT': {
        top =
          (this.elementOffset.top + this.elementOffset.bottom - this.height) / 2 +
          this.correctionTop;
        left = Math.floor(this.elementOffset.right + this.margin + this.correctionLeft);
        break;
      }
      case 'BOTTOM_RIGHT': {
        top = Math.floor(this.elementOffset.bottom + this.correctionTop + this.margin);
        left =
          (this.elementOffset.left + this.elementOffset.right) / 2 -
          this.arrowSize * 2 +
          this.correctionLeft;
        break;
      }
      case 'BOTTOM': {
        top = Math.floor(this.elementOffset.bottom + this.correctionTop + this.margin);
        left =
          (this.elementOffset.left + this.elementOffset.right - this.width) / 2 +
          this.correctionLeft;
        break;
      }
      case 'BOTTOM_LEFT': {
        top = Math.floor(this.elementOffset.bottom + this.correctionTop + this.margin);
        left =
          this.elementOffset.left -
          this.width +
          (this.elementOffset.right - this.elementOffset.left) / 2 +
          this.arrowSize * 2 +
          this.correctionLeft;
        break;
      }
      case 'LEFT': {
        top =
          (this.elementOffset.top + this.elementOffset.bottom - this.height) / 2 +
          this.correctionTop;
        left = Math.ceil(this.elementOffset.left - this.width - this.margin + this.correctionLeft);
        break;
      }
      case 'TOP_LEFT': {
        top = Math.ceil(this.elementOffset.top + this.correctionTop - this.height - this.margin);
        left =
          this.elementOffset.left -
          this.width +
          (this.elementOffset.right - this.elementOffset.left) / 2 +
          this.arrowSize * 2 +
          this.correctionLeft;
        break;
      }
      default: {
        top = this.centerCoords.top + this.correctionTop;
        left = this.centerCoords.left + this.correctionLeft;
        break;
      }
    }
    let correctionHeight = 0;
    let correctionWidth = 0;
    if (top < 0) {
      correctionHeight = -top;
    }
    if (left < 0) {
      correctionWidth = -left;
    }
    const cannotFit =
      this.height - correctionHeight < this.minHeight ||
      this.width - correctionWidth < this.minWidth;
    if (cannotFit && !forcePosition && position !== 'CENTER') {
      positionsParsed++;
      let nextPosition: GuidedTourPosition =
        POSITIONS[(POSITIONS.indexOf(position) + 1) % POSITIONS.length];
      if (nextPosition === 'CENTER') {
        nextPosition = POSITIONS[(POSITIONS.indexOf(nextPosition) + 1) % POSITIONS.length];
      }
      if (positionsParsed === POSITIONS.length) {
        return this._parsePosition('BOTTOM', positionsParsed, true);
      } else {
        return this._parsePosition(nextPosition, positionsParsed);
      }
    } else {
      top = Math.max(0, top);
      left = Math.max(0, left);
      return {
        styleProps: DOMUtils.toPixel({
          top,
          left,
          maxHeight: this.maxHeight - correctionHeight,
          maxWidth: this.maxWidth - correctionWidth,
        }),
        truePosition: position,
        scrollOffset: {
          top: Math.max(
            0,
            Math.min(
              top,
              this.elementOffset.top,
              (Math.min(top, this.elementOffset.top) +
                Math.max(top + this.height, this.elementOffset.bottom + this.correctionTop) -
                document.documentElement.clientHeight) /
                2,
            ),
          ),
          left: Math.max(
            0,
            Math.min(
              left,
              this.elementOffset.left,
              (Math.min(left, this.elementOffset.left) +
                Math.max(left + this.width, this.elementOffset.right + this.correctionLeft) -
                document.documentElement.clientWidth) /
                2,
            ),
          ),
        },
      };
    }
  }
};
