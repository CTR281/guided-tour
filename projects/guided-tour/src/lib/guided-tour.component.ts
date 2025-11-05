import { Component } from '@angular/core';
import { SpotlightComponent } from './spotlight/spotlight.component';
import { PopupComponent } from './popup/popup.component';
import { ArrowComponent } from './arrow/arrow.component';

@Component({
  selector: 'guided-tour',
  standalone: true,
  imports: [SpotlightComponent, PopupComponent, ArrowComponent],
  template: `
    <guided-tour-spotlight class="guided-tour-spotlight"></guided-tour-spotlight>
    <guided-tour-popup class="guided-tour-popup"></guided-tour-popup>
    <guided-tour-arrow class="guided-tour-arrow"></guided-tour-arrow>
  `,
})
export class GuidedTourComponent {}
