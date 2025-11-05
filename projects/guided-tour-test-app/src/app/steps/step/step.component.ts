import { Component, Input, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { GuidedTourModule } from 'guided-tour';

@Component({
  selector: 'guided-tour-step',
  standalone: true,
  imports: [CommonModule, GuidedTourModule],
  templateUrl: 'step.component.html',
  styleUrl: 'step.component.scss',
})
export class GuidedTourStepComponent implements OnDestroy {
  @Input() stepInput = 'noInput';
  constructor() {
    console.log('step');
  }

  ngOnDestroy() {
    console.log('GuidedTourStepComponent destroyed');
  }
}
