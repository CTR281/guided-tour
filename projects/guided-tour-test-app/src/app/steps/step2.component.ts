import { Component, OnDestroy } from '@angular/core';
import { GuidedTourModule } from 'guided-tour';

@Component({
  selector: 'guided-tour-step',
  standalone: true,
  imports: [GuidedTourModule],
  template:
    '<button guided-tour-skip>Skip</button><button guided-tour-prev>Previous</button><button guided-tour-next>Next</button>',
  styles: '',
})
export class GuidedTourStep2Component implements OnDestroy {
  constructor() {
    console.log('step 2');
  }

  ngOnDestroy() {
    console.log('GuidedTourStep2Component destroyed');
  }
}
