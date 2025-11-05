import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { StepConfig } from '../guided-tour';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private _popupPosition = new ReplaySubject<StepConfig>(1);

  public popupPosition$: Observable<StepConfig>;

  constructor() {
    this.popupPosition$ = this._popupPosition.asObservable();
  }

  broadcast(stepConfig: StepConfig) {
    this._popupPosition.next(stepConfig);
  }
}
