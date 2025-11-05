import { AfterViewInit, Component, DestroyRef, ElementRef, inject, Renderer2 } from '@angular/core';
import { ConfigurableElement } from '../models/ConfigurableElement';
import { StepConfig, ParseableStepConfig, StyleProps } from '../guided-tour';
import { PopupService } from '../popup/popup.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArrowParser } from './ArrowParser';

@Component({
  selector: 'guided-tour-arrow',
  standalone: true,
  imports: [],
  template: '',
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1001;
        border-style: solid;
        border-color: transparent;
        border-bottom-color: #fff;
        border-width: 0;
      }
    `,
  ],
})
export class ArrowComponent extends ConfigurableElement implements AfterViewInit {
  protected override Parser = ArrowParser;

  private _popupService = inject(PopupService);
  private _destroyRef = inject(DestroyRef);

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(_ref: ElementRef, _renderer: Renderer2) {
    super(_ref.nativeElement, _renderer);
  }

  ngAfterViewInit() {
    this._popupService.popupPosition$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((stepConfig) => this.updateElement(stepConfig));
  }

  protected override defaultConfig(): StyleProps {
    return {
      border: '0',
    };
  }

  protected override parseConfig(stepConfig: StepConfig) {
    this.setStyleProps(stepConfig.arrowConfig.styleProps);
    if (!this.isParseableConfig(stepConfig)) {
      this.setStyleProps(this.defaultConfig());
    }
  }

  protected override parsePosition(stepConfig: StepConfig) {
    if (super.isParseableConfig(stepConfig)) {
      const parser = new this.Parser(stepConfig as ParseableStepConfig);
      this.setStyleProps(parser.parse().styleProps);
    }
  }
}
