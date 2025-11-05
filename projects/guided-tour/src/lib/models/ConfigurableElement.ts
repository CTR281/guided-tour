import { StepConfig, StyleProps } from '../guided-tour';
import { Renderer2 } from '@angular/core';
import { StepConfigParser } from './StepConfigParser';

// Template method pattern
export abstract class ConfigurableElement {
  /** A *black box* where the position of the Element is calculated.
   *
   * Each derived class must *define* how those calculations happen. */
  protected abstract Parser: typeof StepConfigParser;

  protected constructor(
    protected el: Element,
    private _renderer: Renderer2,
  ) {}

  protected abstract defaultConfig(): StyleProps;

  /**
   * Updates the Element in three steps:
   * - removes style related to the previous step
   * - parses config related to the Element
   * - calculates its new position
   *
   * Inner methods are designed to be overridden by the derived classes; this method however should remain as is, ideally.
   * @param stepConfig
   * @protected
   */
  protected updateElement(stepConfig: StepConfig): void {
    this.resetStyleProps();
    this.parseConfig(stepConfig);
    this.parsePosition(stepConfig);
  }

  /**
   * Parses config related to the Element
   * @param stepConfig
   * @protected
   */
  protected abstract parseConfig(stepConfig: StepConfig): void;

  /**
   * Determines the position of the Element based on the current step's config.
   * @param stepConfig
   * @protected
   */
  protected abstract parsePosition(stepConfig: StepConfig): void;

  /**
   * Assert if the config can be cast to a ParseableStepConfig
   * @param stepConfig
   * @protected
   */
  protected isParseableConfig(stepConfig: StepConfig): boolean {
    return !(!stepConfig.selector || !stepConfig.element);
  }

  /**
   * Remove all inline style properties
   * @protected
   */
  protected resetStyleProps() {
    this._renderer.removeAttribute(this.el, 'style');
  }

  /**
   * Add new inline style properties to the element
   * @param styleProps a set of css properties
   * @protected
   */
  protected setStyleProps(styleProps: StyleProps) {
    for (const prop in styleProps) {
      if (Object.prototype.hasOwnProperty.call(styleProps, prop)) {
        this._renderer.setStyle(this.el, prop, styleProps[prop]);
      }
    }
  }
}
