import { Directive, HostListener, inject } from '@angular/core';
import { GuidedTourService } from './guided-tour.service';

@Directive({
  selector: '[guided-tour-next]',
  exportAs: 'GuidedTourNext',
  standalone: true,
})
export class GuidedTourNext {
  private tour = inject(GuidedTourService);

  @HostListener('click') onClick() {
    this.tour.next();
  }
}

@Directive({
  selector: '[guided-tour-prev]',
  exportAs: 'GuidedTourPrev',
  standalone: true,
})
export class GuidedTourPrevious {
  private tour = inject(GuidedTourService);

  @HostListener('click') onClick() {
    this.tour.previous();
  }
}

@Directive({
  selector: '[guided-tour-skip]',
  exportAs: 'GuidedTourSkip',
  standalone: true,
})
export class GuidedTourSkip {
  private tour = inject(GuidedTourService);

  @HostListener('click') onClick() {
    this.tour.skip();
  }
}

@Directive({
  selector: '[guided-tour-finish]',
  exportAs: 'GuidedTourFinish',
  standalone: true,
})
export class GuidedTourFinish {
  private tour = inject(GuidedTourService);

  @HostListener('click') onClick() {
    this.tour.finish();
  }
}

export const DIRECTIVES = [GuidedTourNext, GuidedTourPrevious, GuidedTourFinish, GuidedTourSkip];
