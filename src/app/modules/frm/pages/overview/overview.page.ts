import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { DIAMOND_COLORS } from '../../../shared/models/diamond-colors';
import { NARIC_COUNTRIES } from '../../../shared/models/naric-countries';
import { FAKE_TESTIMONIALS, IFakeTestimonial } from '../../../shared/models/testimonial';
import { MetaHelper } from '../../../shared/helpers/meta.helper';

@Component({
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage extends MetaHelper implements OnInit {
  public widthTypes = HEADER_WIDTH_TYPES;
  public diamondColors = DIAMOND_COLORS;
  public naricCountries = NARIC_COUNTRIES;
  public fakeTestimonials: Array<IFakeTestimonial> = FAKE_TESTIMONIALS;

  constructor(
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();
  }
}
