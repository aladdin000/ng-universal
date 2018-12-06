import { Component, Input } from '@angular/core';

import { diamondColors } from '../../models/diamond-colors';

@Component({
  selector: 'app-plan-box',
  templateUrl: './plan-box.component.html',
  styleUrls: ['./plan-box.component.scss'],
})
export class PlanBoxComponent {
  @Input() public title: string;
  @Input() public color: diamondColors;
}
