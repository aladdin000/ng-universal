import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap';

import { IFakeTestimonial } from '../../../shared/models/testimonial';
import { VideoModal } from '../../modals';

@Component({
  selector: 'app-grid-slide-video',
  templateUrl: './grid-slide-video.component.html',
  styleUrls: ['./grid-slide-video.component.scss'],
})
export class GridSlideVideoComponent implements OnInit {
  @Input() public testimonial: IFakeTestimonial;
  @Input() public color: string;

  public bgStyle: string;

  private modalOptions = new ModalOptions();

  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    this.bgStyle = `url(${this.testimonial.photo})`;
    this.modalOptions.initialState = {
      title: this.testimonial.name,
      video: this.testimonial.video,
    };
  }

  public onClick(): void {
    this.modalService.show(VideoModal, this.modalOptions);
  }
}
