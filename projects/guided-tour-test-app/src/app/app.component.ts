import { CommonModule } from '@angular/common';
import { GuidedTourStep2Component } from './steps/step2.component';
import { GuidedTourFinishComponent } from './steps/final.component';
import { StartComponent } from './steps/start/start.component';
import { GuidedTourStepComponent } from './steps/step/step.component';
import { GuidedTourSkipComponent } from './steps/skip.component';
import { GuidedTourStepConfig, GuidedTourService, GuidedTourGlobalConfig } from 'guided-tour';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'guided-tour-homepage';
  mockSteps: GuidedTourStepConfig[] = [
    {
      stepComponent: {
        component: StartComponent,
      },
      popupConfig: {
        corrections: {
          //correctionMargin: 32,
          //correctionTop: -16,
          //correctionLeft: 100
        },
        styleProps: { maxHeight: '200px' },
      },
    },
    {
      selector: '.fixed',
      stepComponent: {
        component: GuidedTourStepComponent,
      },
      spotlightConfig: {
        styleProps: {
          outline: '5px solid blue',
        },
      },
      popupConfig: {
        corrections: {
          //correctionMargin: 32,
          //correctionTop: -16,
          //correctionLeft: 100
        },
      },
      position: 'BOTTOM',
      scroll: true,
    },
    {
      selector: 'svg',
      stepComponent: {
        component: GuidedTourStepComponent,
      },
      spotlightConfig: {
        styleProps: {
          outline: '5px solid blue',
        },
      },
      popupConfig: {
        corrections: {
          //correctionMargin: 32,
          //correctionTop: -16,
          //correctionLeft: 100
        },
        styleProps: { height: '800px' },
      },
      position: 'BOTTOM_LEFT',
      forcePosition: true,
      scroll: true,
    },
    {
      selector: '.content',
      stepComponent: {
        component: GuidedTourStepComponent,
        inputs: { stepInput: '.content step' },
      },
      spotlightConfig: {
        styleProps: {
          height: '500px',
          outline: 'none',
        },
      },
      popupConfig: {
        corrections: {
          //margin: 100,
          //correctionLeft: 20,
          //correctionTop: -50
        },
        styleProps: {
          // maxHeight: '2000px',
          // height: '2000px',
          // width: '600px',
          // maxWidth: '600px'
        },
      },
      position: 'BOTTOM',
      scroll: true,
    },
    {
      selector: '.offscreen',
      stepComponent: {
        component: GuidedTourStepComponent,
      },
      spotlightConfig: {
        styleProps: {
          outline: '5px solid blue',
        },
      },
      popupConfig: {
        //correctionMargin: 32,
        //correctionLeft: 100
      },
      position: 'TOP',
      scroll: true,
    },
    {
      selector: '.right-side',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      scroll: false,
      position: 'LEFT',
      popupConfig: {
        corrections: {
          //correctionTop: 100,
          //correctionLeft: -1000
        },
        styleProps: {
          //height:'100px'
        },
      },
    },
    {
      selector: '#tour',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      position: 'TOP_RIGHT',
      popupConfig: {
        corrections: {
          //correctionTop: -100,
          // correctionLeft: -50
        },
        styleProps: {
          maxHeight: '2000px',
          height: '1000px',
          width: '350px',
        },
      },
    },
    {
      selector: '#tour',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      position: 'TOP_LEFT',
      popupConfig: {
        corrections: {
          //correctionTop: -100,
          // correctionLeft: -50
        },
        styleProps: {
          height: '1000px',
          width: '350px',
        },
      },
    },
    {
      selector: '#tour',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      position: 'BOTTOM_RIGHT',
      popupConfig: {
        corrections: {
          //correctionTop: -100,
          // correctionLeft: -50
        },
        styleProps: {
          height: '1000px',
          width: '350px',
        },
      },
    },
    {
      selector: '.right-side',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      position: 'LEFT',
    },
    {
      selector: '.right-side',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      position: 'TOP',
    },
    {
      selector: 'wrong selector',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      position: 'TOP',
    },
    {
      selector: '.divider',
      stepComponent: {
        component: GuidedTourStep2Component,
      },
      position: 'TOP',
    },
    {
      stepComponent: {
        component: GuidedTourFinishComponent,
      },
    },
  ];

  options: GuidedTourGlobalConfig = {
    skip: { stepComponent: { component: GuidedTourSkipComponent, inputs: {} } },
    spotlightConfig: {
      padding: 5,
      styleProps: {
        outline: '5px solid blue',
      },
    },
    popupConfig: {
      corrections: {
        correctionMargin: 25,
      },
      styleProps: {
        //maxHeight: '300px'
      },
    },
  };

  tour = inject(GuidedTourService);

  constructor() {
    console.log('guided-tour-homepage');
    window.addEventListener('DOMContentLoaded', () => {
      this.tour.run(this.mockSteps, this.options);
    });
  }

  startTour() {
    this.tour.run(this.mockSteps, this.options);
    console.log(this.tour.stepsCount);
  }

  next() {
    this.tour.next();
    console.log(this.tour.currentStepIndex);
  }
}
