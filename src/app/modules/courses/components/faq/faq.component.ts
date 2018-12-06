import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-courses-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  @Input() data: Array<any> = [];
}
