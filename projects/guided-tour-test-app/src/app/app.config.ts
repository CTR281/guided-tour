import { ApplicationConfig } from '@angular/core';
import { provideGuidedTour } from 'guided-tour';

export const appConfig: ApplicationConfig = {
  providers: [provideGuidedTour()],
};
