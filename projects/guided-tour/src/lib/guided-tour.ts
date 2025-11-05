// Internal types

import { Type } from '@angular/core';
import { GuidedTourPosition } from './guided-tour.types';
import { SpotlightConfig } from './spotlight/spotlight';
import { PopupConfig } from './popup/popup';
import { ArrowConfig } from './arrow/arrow';

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type StyleProps = Partial<CSSStyleDeclaration>;

export type WithId<T> = T & { id: number };

export interface StepComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: Type<any>;
  inputs?: Record<string, unknown>;
}

/**
 * Base interface for every element's config
 * */
export interface ElementConfig {
  /** All values will be added to their respective css property
   * For example: assuming the element's top property is 80px; correctionTop: 10 -> top: 80 + 10
   * */
  corrections: Record<string, unknown>;
  /**
   * CSS rules to override default element's css
   */
  styleProps: StyleProps;
}

export interface ElementsConfig {
  spotlightConfig: SpotlightConfig;
  popupConfig: PopupConfig;
  arrowConfig: ArrowConfig;
}

export interface StepConfig extends ElementsConfig {
  id: number;
  stepComponent: StepComponent;
  selector?: string;
  element?: Element;
  scroll: boolean;
  position: GuidedTourPosition;
  forcePosition: boolean;
}

export const DEFAULT_STEP_CONFIG: Pick<StepConfig, 'scroll' | 'position' | 'forcePosition'> = {
  scroll: true,
  position: 'CENTER',
  forcePosition: false,
};

export type ParseableStepConfig = RequiredFields<StepConfig, 'element'>;
export const POSITIONS = [
  'TOP',
  'TOP_LEFT',
  'LEFT',
  'BOTTOM_LEFT',
  'BOTTOM',
  'BOTTOM_RIGHT',
  'RIGHT',
  'TOP_RIGHT',
  'CENTER',
] as const;
