import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import { IFakeTestimonial } from '../../../shared/models/testimonial';

@Component({
  selector: 'app-grid-slider',
  templateUrl: './grid-slider.component.html',
  styleUrls: ['./grid-slider.component.scss'],
})
export class GridSliderComponent implements OnInit {
  @Input() public testimonial: Array<IFakeTestimonial>;
  @Input() public color: string;

  @ViewChild('sliderTrack') private sliderTrack: ElementRef;
  @ViewChild('arrowLeft') private arrowLeft: ElementRef;
  @ViewChild('arrowRight') private arrowRight: ElementRef;

  public allSlides: Array<Array<IFakeTestimonial>> = [];
  public arrows = {
    isLeftHidden: true,
    isRightHidden: false,
  };

  private hideClass = 'hide';
  private slideWidth = 346;
  private currentSliderPosition = 0;
  private slidesCount = 6;
  private slidesOnPage = 3;
  private currentPage = 1;
  private totalPages: number;

  constructor(private renderer: Renderer2) {
    this.totalPages = this.slidesCount - this.slidesOnPage;
  }

  private get slideStyle(): string {
    const offset = this.currentSliderPosition
      ? `-${this.currentSliderPosition}px`
      : 0
    ;

    return `translateX(${offset})`;
  }

  ngOnInit() {
    const slides = this.testimonial.slice(0, 12);

    for (let i = 0; i < 6; i++) {
      this.allSlides[i] = slides.splice(0, 2);
    }
  }

  public goToNextPage(): void {
    if (this.currentPage === this.totalPages) return;

    this.currentPage += 1;
    this.currentSliderPosition = (this.currentPage - 1) * this.slideWidth;

    if (this.currentPage === this.totalPages) {
      this.arrows.isRightHidden = true;
    } else if (!this.arrows.isRightHidden && this.currentPage !== this.totalPages) {
      this.arrows.isRightHidden = false;
      this.arrows.isLeftHidden = false;
    }

    this.updateArrowClass();
    this.updateElement();
  }

  public goToPrevPage(): void {
    if (this.currentPage === 1) return;

    this.currentPage -= 1;
    this.currentSliderPosition = (this.currentPage - 1) * this.slideWidth;

    if (this.currentPage === 1) {
      this.arrows.isLeftHidden = true;
    } else if (!this.arrows.isLeftHidden && this.currentPage !== this.totalPages) {
      this.arrows.isLeftHidden = false;
      this.arrows.isRightHidden = false;
    }

    this.updateArrowClass();
    this.updateElement();
  }

  private updateArrowClass(): void {
    if (this.arrows.isLeftHidden) {
      this.renderer.addClass(
        this.arrowLeft.nativeElement,
        this.hideClass,
      );
    } else {
      this.renderer.removeClass(
        this.arrowLeft.nativeElement,
        this.hideClass,
      );
    }

    if (this.arrows.isRightHidden) {
      this.renderer.addClass(
        this.arrowRight.nativeElement,
        this.hideClass,
      );
    } else {
      this.renderer.removeClass(
        this.arrowRight.nativeElement,
        this.hideClass,
      );
    }
  }

  private updateElement(): void {
    this.renderer.setStyle(
      this.sliderTrack.nativeElement,
      'transform',
      this.slideStyle,
    );
  }
}
