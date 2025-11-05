import { Component } from '@angular/core';
import { GuidedTourModule } from 'guided-tour';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [GuidedTourModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {}
