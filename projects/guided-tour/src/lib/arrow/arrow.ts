import { ElementConfig } from '../guided-tour';

export interface ArrowConfig extends ElementConfig {
  arrowSize: number;
}

export const DEFAULT_ARROW_CONFIG: ArrowConfig = {
  corrections: {},
  arrowSize: 16,
  styleProps: {},
};
