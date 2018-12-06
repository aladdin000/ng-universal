import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { Testimonial } from '../../../../models/testimonial';
import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { TestimonialService } from '../../../../services';

@Component({
  templateUrl: './spotlight.page.html',
  styleUrls: ['./spotlight.page.scss'],
})
export class SpotlightPage extends MetaHelper implements OnInit {
  public testimonials: Array<Testimonial> = [];

  constructor(
    private testimonialService: TestimonialService,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.testimonialService.getTestimonials()
      .subscribe(
        testimonials => this.testimonials = testimonials
      );
  }
}
