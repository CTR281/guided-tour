import { POSITIONS, StepComponent } from './guided-tour';
import { PopupConfig } from './popup/popup';
import { SpotlightConfig } from './spotlight/spotlight';
import { ArrowConfig } from './arrow/arrow';

type GuidedTourPositions = typeof POSITIONS;

export type GuidedTourPosition = GuidedTourPositions[number];

type PartialDeep<T> = { [K in keyof T]?: Partial<T[K]> };

interface GuidedTourElementsConfig {
  spotlightConfig?: PartialDeep<SpotlightConfig>;
  popupConfig?: PartialDeep<PopupConfig>;
  arrowConfig?: PartialDeep<ArrowConfig>;
}

export interface GuidedTourStepConfig extends GuidedTourElementsConfig {
  /** The CSS selector of the element to highlight. If several elements match, only the first element will be considered. */
  selector?: string;
  /** The Angular component to display in the dialog. */
  stepComponent: StepComponent;
  /** If set to true, will scroll to the highlighted element at the start of the step. Defaults to *true*. */
  scroll?: boolean;
  /** The position to place the tour dialog. Defaults to 'CENTER'.
   *
   * Depending on the popup config, the position specified may not be possible; in that case, the tour will resort to
   * any other position that is acceptable.
   *
   * The 'BOTTOM' position is guaranteed to work.
   *
   * Note: position will be ignored if no selector is set.
   * */
  position?: GuidedTourPosition;
  /** If set to true, the dialog's position will be enforced even if it does not fit.*/
  forcePosition?: boolean;
}

export interface GuidedTourGlobalConfig extends GuidedTourElementsConfig {
  /** The Angular component to use as the skip slide. Note: if it is not specified, the last slide will act as the skip slide*/
  skip?: GuidedTourStepConfig;
}
