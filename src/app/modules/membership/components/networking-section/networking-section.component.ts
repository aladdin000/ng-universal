import { Component, Input } from '@angular/core';

import { Network } from '../../models/network';

@Component({
  selector: 'app-membership-networking-section',
  templateUrl: './networking-section.component.html',
  styleUrls: ['./networking-section.component.scss'],
})
export class NetworkingSectionComponent {
  @Input() public network: Network;
}
