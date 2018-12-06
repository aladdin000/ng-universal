import { Component, Input, OnInit } from '@angular/core';

import { IFakeTestimonial } from '../../../shared/models/testimonial';

@Component({
  selector: 'app-grid-slide-text',
  templateUrl: './grid-slide-text.component.html',
  styleUrls: ['./grid-slide-text.component.scss'],
})
export class GridSlideTextComponent implements OnInit {
  @Input() public testimonial: IFakeTestimonial;
  public text: string;

  ngOnInit() {
    const textLength = 70;

    this.text = this.testimonial.content.length > textLength
      ? `${this.testimonial.content.substr(0, textLength)}...`
      : this.testimonial.content
    ;
  }
}
