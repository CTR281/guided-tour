import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidedTourService } from '../guided-tour.service';
import { ConfigurableElement } from '../models/ConfigurableElement';
import { DOMUtils } from '../utils/DOMUtils';
import { StepConfig, StyleProps, ParseableStepConfig } from '../guided-tour';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupParser } from './PopupParser';
import { PopupService } from './popup.service';

@Component({
  selector: 'guided-tour-popup',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-container #container></ng-container>',
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        z-index: 1001;
        background: white;
        pointer-events: all;
        overflow: auto;
      }
    `,
  ],
})
export class PopupComponent extends ConfigurableElement implements AfterViewInit {
  protected override Parser = PopupParser;

  _tour = inject(GuidedTourService);
  private _popupService = inject(PopupService);
  private _destroyRef = inject(DestroyRef);

  @ViewChild('container', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private stepComponent?: ComponentRef<any>;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(_ref: ElementRef, _renderer: Renderer2) {
    super(_ref.nativeElement, _renderer);
  }

  // Subscribing in AfterViewInit allows observers to manipulate the template
  ngAfterViewInit() {
    this._tour.currentStep$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((stepConfig) => this.updateElement(stepConfig));
  }

  public center() {
    return {
      top: (document.documentElement.clientHeight - this.height()) / 2,
      left: (document.documentElement.clientWidth - this.width()) / 2,
    };
  }

  public height() {
    return Math.ceil(this.el.getBoundingClientRect().height);
  }

  public width() {
    return Math.ceil(this.el.getBoundingClientRect().width);
  }

  protected override defaultConfig(): StyleProps {
    return {
      ...DOMUtils.toPixel({
        ...this.center(),
      }),
    };
  }

  protected override parseConfig(stepConfig: StepConfig) {
    this.setStyleProps(stepConfig.popupConfig.styleProps);
    this.updateStepComponent(stepConfig);
    if (!this.isParseableConfig(stepConfig)) {
      this.setStyleProps(this.defaultConfig());
    }
  }

  protected override parsePosition(stepConfig: StepConfig) {
    if (this.isParseableConfig(stepConfig)) {
      const parser = new this.Parser(
        stepConfig as ParseableStepConfig,
        this.height(),
        this.width(),
        this.center(),
      );
      const { styleProps, truePosition, scrollOffset } = parser.parse();
      this.setStyleProps(styleProps);
      if (stepConfig.scroll && stepConfig.element && !DOMUtils.isFixedElement(stepConfig.element)) {
        scrollTo({ ...scrollOffset, behavior: 'smooth' });
      }
      this._popupService.broadcast({ ...stepConfig, position: truePosition });
    } else {
      scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      this._popupService.broadcast({ ...stepConfig, position: 'CENTER' });
    }
  }

  /**
   * Remove any element within the popup's view and inject the current step's component
   * @param stepConfig
   * @private
   */
  private updateStepComponent(stepConfig: StepConfig) {
    this.viewContainerRef.clear();
    this.stepComponent = this.viewContainerRef.createComponent(stepConfig.stepComponent.component);
    for (const prop in stepConfig.stepComponent.inputs) {
      if (Object.prototype.hasOwnProperty.call(stepConfig.stepComponent.inputs, prop)) {
        this.stepComponent.setInput(prop, stepConfig.stepComponent.inputs[prop]);
      }
    }
    this.stepComponent.injector.get(ChangeDetectorRef).detectChanges();
  }
}
