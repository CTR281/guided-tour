import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidedTourModule } from 'guided-tour';

@Component({
  selector: 'guided-tour-final',
  standalone: true,
  imports: [CommonModule, GuidedTourModule],
  template: `<button guided-tour-prev>Previous</button><button guided-tour-finish>Finish</button>`,
  styles: '',
})
export class GuidedTourFinishComponent {}
