import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  DestroyRef,
  inject,
  Injectable,
} from '@angular/core';
import { GuidedTourStepConfig, GuidedTourGlobalConfig } from './guided-tour.types';
import { debounceTime, fromEvent, Observable, ReplaySubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { GuidedTourComponent } from './guided-tour.component';
import { DEFAULT_STEP_CONFIG, StepConfig, WithId } from './guided-tour';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DEFAULT_POPUP_CONFIG } from './popup/popup';
import { DEFAULT_SPOTLIGHT_CONFIG } from './spotlight/spotlight';
import { DOMUtils } from './utils/DOMUtils';
import { DEFAULT_ARROW_CONFIG } from './arrow/arrow';

@Injectable()
export class GuidedTourService {
  public currentStep$: Observable<StepConfig>;

  // Steps as submitted by the user via run()
  private _userSteps: WithId<GuidedTourStepConfig>[] = [];
  private _userOptions?: GuidedTourGlobalConfig;
  // Filtered steps, fit for use within the lib
  private _steps: StepConfig[] = [];
  private _currentStep: ReplaySubject<StepConfig> = new ReplaySubject<StepConfig>(1);
  private _activeStep: StepConfig | null = null;
  private _currentStepIndex = -1;
  private _previousStepIndex = -1;
  private _skip?: StepConfig | null = null;

  private _appRef = inject(ApplicationRef);
  private _document = inject(DOCUMENT);

  // The tour component associated with the current guided tour. If it is not null, then a guided tour is active.
  private static _tourRef: ComponentRef<GuidedTourComponent> | null = null;

  get currentStep() {
    return this._steps[this.currentStepIndex];
  }

  get currentStepIndex() {
    return this._currentStepIndex;
  }

  get stepsCount() {
    return this._steps.length;
  }

  constructor() {
    this.currentStep$ = this._currentStep.asObservable();
  }

  /** Call this method to launch the guided tour. */
  run(steps: GuidedTourStepConfig[], options?: GuidedTourGlobalConfig) {
    if (GuidedTourService._tourRef !== null || steps.length === 0) {
      return;
    }

    this._userSteps = steps.map((step, k) => ({ ...step, id: k }));
    this._steps = this.parseSteps(this._userSteps, options);
    if (this._steps.length === 0) {
      this._userSteps = [];
      return;
    }
    this._userOptions = options;
    if (options?.skip) {
      this._skip = this.setStepConfig({ ...options?.skip, id: -1 }, options);
    }

    // Inject GuidedTourComponent at the root of the DOM and bind its ref to the Tour
    const hostElement = this._document.createElement('div');
    this._document.body.appendChild(hostElement);
    GuidedTourService._tourRef = createComponent(GuidedTourComponent, {
      hostElement,
      environmentInjector: this._appRef.injector,
    });
    this._appRef.attachView(GuidedTourService._tourRef.hostView);
    GuidedTourService._tourRef.changeDetectorRef.detectChanges();

    this.initListeners(GuidedTourService._tourRef.injector.get(DestroyRef));

    this.next();
  }

  next() {
    if (this.currentStepIndex < this.stepsCount - 1) {
      this._previousStepIndex = this._currentStepIndex++;
      this.updateStep(this.currentStep);
    } else {
      this.finish();
    }
  }

  previous() {
    this._currentStepIndex = this._previousStepIndex;
    if (this._previousStepIndex > 0) {
      this._previousStepIndex--;
    }
    this.updateStep(this.currentStep);
  }

  skip() {
    this._previousStepIndex = this._currentStepIndex;
    if (this._skip) {
      this.updateStep(this._skip);
    } else {
      this.updateStep(this._steps[this.stepsCount - 1]);
    }
  }

  finish() {
    this.resetTour();
  }

  refresh() {
    if (this._activeStep) {
      this._currentStep.next(this._activeStep);
    }
  }

  restart() {
    this._currentStepIndex = -1;
    this.next();
  }

  isFirstStep(): boolean {
    return this._activeStep === this._steps[0];
  }

  isLastStep(): boolean {
    return this._activeStep === this._steps[this.stepsCount - 1];
  }

  isSkipStep(): boolean {
    return this._activeStep === this._skip;
  }

  private resetTour(): void {
    GuidedTourService._tourRef?.destroy();
    GuidedTourService._tourRef = null;
    this._steps = [];
    this._userSteps = [];
    this._userOptions = undefined;
    this._currentStep.complete();
    this._currentStep = new ReplaySubject<StepConfig>(1);
    this.currentStep$ = this._currentStep.asObservable();
    this._activeStep = null;
    this._currentStepIndex = -1;
    this._previousStepIndex = -1;
    this._skip = null;
  }

  private updateStep(step: StepConfig): void {
    this._activeStep = step;
    this._currentStep.next(step);
  }

  /**
   * Subscribe to window events to refresh tour accordingly.
   *
   * These subscriptions are tied to an active tour, and thus are reset whenever the tour is finished i.e.
   * guided tour component is destroyed
   *
   * @param destroyRef the *GuidedTourComponent's* DestroyRef, as per the above.
   * @private
   */
  private initListeners(destroyRef: DestroyRef) {
    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        const newSteps = this.parseSteps(this._userSteps, this._userOptions);
        if (
          newSteps.length === this._steps.length &&
          newSteps.every((step, k) => step.id === this._steps[k].id)
        ) {
          this.refresh();
        } else {
          if (newSteps.length === 0) {
            this.resetTour();
          } else {
            this._steps = newSteps;
            this.restart();
          }
        }
      });

    fromEvent(window, 'scrollend')
      .pipe(debounceTime(150), takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        if (this._activeStep?.element && DOMUtils.isFixedElement(this._activeStep.element)) {
          this.refresh();
        }
      });
  }

  private setStepConfig(
    stepConfig: WithId<GuidedTourStepConfig>,
    globalConfig?: GuidedTourGlobalConfig,
    element?: Element,
  ): StepConfig {
    return {
      element,
      ...DEFAULT_STEP_CONFIG,
      ...stepConfig,
      popupConfig: {
        ...DEFAULT_POPUP_CONFIG,
        ...globalConfig?.popupConfig,
        ...stepConfig.popupConfig,
        corrections: {
          ...DEFAULT_POPUP_CONFIG.corrections,
          ...globalConfig?.popupConfig?.corrections,
          ...stepConfig.popupConfig?.corrections,
        },
        styleProps: {
          ...DEFAULT_POPUP_CONFIG.styleProps,
          ...globalConfig?.popupConfig?.styleProps,
          ...stepConfig.popupConfig?.styleProps,
        },
      },
      spotlightConfig: {
        ...DEFAULT_SPOTLIGHT_CONFIG,
        ...globalConfig?.spotlightConfig,
        ...stepConfig.spotlightConfig,
        corrections: {
          ...DEFAULT_SPOTLIGHT_CONFIG.corrections,
          ...globalConfig?.spotlightConfig?.corrections,
          ...stepConfig.spotlightConfig?.corrections,
        },
        styleProps: {
          ...DEFAULT_SPOTLIGHT_CONFIG.styleProps,
          ...globalConfig?.spotlightConfig?.styleProps,
          ...stepConfig.spotlightConfig?.styleProps,
        },
      },
      arrowConfig: {
        ...DEFAULT_ARROW_CONFIG,
        ...globalConfig?.arrowConfig,
        ...stepConfig?.arrowConfig,
        styleProps: {
          ...DEFAULT_ARROW_CONFIG,
          ...globalConfig?.arrowConfig?.styleProps,
          ...stepConfig?.arrowConfig?.styleProps,
        },
      },
    };
  }

  /**
   * Filter out steps for selectors that are not found / not visible && parse config for each step
   * @param steps
   * @param options
   * @private
   */
  private parseSteps(
    steps: WithId<GuidedTourStepConfig>[],
    options?: GuidedTourGlobalConfig,
  ): StepConfig[] {
    const result: StepConfig[] = [];
    steps.forEach((step) => {
      if (!step.selector) {
        result.push(this.setStepConfig(step, options));
      } else {
        const element = this._document.querySelector(step.selector);
        if (element && !DOMUtils.isNotVisible(element)) {
          result.push(this.setStepConfig(step, options, element));
        }
      }
    });
    return result;
  }
}
