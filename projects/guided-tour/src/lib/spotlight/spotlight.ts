import { ElementConfig } from '../guided-tour';

export interface SpotlightConfig extends ElementConfig {
  corrections: {
    correctionTop: number;
    correctionLeft: number;
    correctionHeight: number;
    correctionWidth: number;
  };
  /**
   * Extra space around highlighted element
   */
  padding: number;
}

export const DEFAULT_SPOTLIGHT_CONFIG: SpotlightConfig = {
  corrections: {
    correctionTop: 0,
    correctionLeft: 0,
    correctionHeight: 0,
    correctionWidth: 0,
  },
  padding: 0,
  styleProps: {
    transition: 'height 0.7s, width 0.7s, top 0.7s, left 0.7s',
  },
};
