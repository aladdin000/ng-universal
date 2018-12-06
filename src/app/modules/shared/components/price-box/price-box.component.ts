import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-price-box',
  templateUrl: './price-box.component.html',
  styleUrls: ['./price-box.component.scss'],
})
export class PriceBoxComponent {
    @Input() public title: string;
    @Input() public startDate: string;
    @Input() public endDate: string;
    @Input() public price: string;
    @Input() public enrollmentFee: string;
    @Input() public examFee: string;
    @Input() public url: string;
    @Input() public disabled: boolean;
}
