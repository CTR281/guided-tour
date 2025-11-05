import { AfterViewInit, Component, DestroyRef, ElementRef, inject, Renderer2 } from '@angular/core';
import { StepConfig, ParseableStepConfig } from '../guided-tour';
import { ConfigurableElement } from '../models/ConfigurableElement';
import { GuidedTourService } from '../guided-tour.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpotlightParser } from './SpotlightParser';

@Component({
  selector: 'guided-tour-spotlight',
  standalone: true,
  imports: [],
  template: '<div class="no-click-backdrop"></div>',
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        height: 0;
        width: 0;
        display: block;
        box-shadow:
          0 0 0 9999999px #000000b3,
          0 0 1.5rem #00000000;
        z-index: 1000;
        pointer-events: none;
      }

      .no-click-backdrop {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        pointer-events: all;
      }
    `,
  ],
})
export class SpotlightComponent extends ConfigurableElement implements AfterViewInit {
  protected override Parser = SpotlightParser;

  private _tour = inject(GuidedTourService);
  private destroyRef = inject(DestroyRef);

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(_ref: ElementRef, _renderer: Renderer2) {
    super(_ref.nativeElement, _renderer);
  }

  // Subscribing in AfterViewInit allows observers to manipulate the template
  ngAfterViewInit() {
    this._tour.currentStep$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((stepConfig) => this.updateElement(stepConfig));
  }

  /**
   * This will hide any 'left-overs' of the spotlight zone (such as the border), without hiding the backdrop
   * @protected
   */
  protected override defaultConfig() {
    return {
      top: '-9999px',
      left: '-9999px',
      transition: 'none',
    };
  }

  protected override parseConfig(stepConfig: StepConfig) {
    this.setStyleProps(stepConfig.spotlightConfig.styleProps);
    if (!this.isParseableConfig(stepConfig)) {
      this.setStyleProps(this.defaultConfig());
    }
  }

  protected override parsePosition(stepConfig: StepConfig) {
    if (this.isParseableConfig(stepConfig)) {
      const parser = new this.Parser(stepConfig as ParseableStepConfig);
      this.setStyleProps(parser.parse().styleProps);
    }
  }
}
