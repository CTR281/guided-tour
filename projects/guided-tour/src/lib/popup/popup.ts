import { ElementConfig, RequiredFields, StyleProps } from '../guided-tour';
import { DEFAULT_ARROW_CONFIG } from '../arrow/arrow';
// Internal
export interface PopupConfig extends ElementConfig {
  corrections: {
    correctionTop: number;
    correctionLeft: number;
    correctionMargin: number;
  };
  /**
   * Distance between spotlight and popup
   */
  margin: number;
  styleProps: RequiredFields<StyleProps, 'maxHeight' | 'maxWidth' | 'minHeight' | 'minWidth'>;
}

export const DEFAULT_POPUP_CONFIG: PopupConfig = {
  corrections: {
    correctionTop: 0,
    correctionLeft: 0,
    correctionMargin: 0,
  },
  margin: DEFAULT_ARROW_CONFIG.arrowSize * 2,
  styleProps: {
    minHeight: '350px',
    maxHeight: '450px',
    minWidth: '350px',
    maxWidth: '450px',
  },
};
