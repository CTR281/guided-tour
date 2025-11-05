import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { GuidedTourService } from './guided-tour.service';
import { DIRECTIVES } from './guided-tour.directives';

/** Inject the guided tour service into your app.*/
export function provideGuidedTour(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: GuidedTourService }]);
}

@NgModule({
  imports: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})
export class GuidedTourModule {
  /**
   * For legacy Angular applications; prefer *provideGuidedTour* for v14+ apps.
   */
  public static forRoot(): ModuleWithProviders<GuidedTourModule> {
    return {
      ngModule: GuidedTourModule,
      providers: [GuidedTourService],
    };
  }
}
