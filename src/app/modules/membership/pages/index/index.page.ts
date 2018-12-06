import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { DIAMOND_COLORS } from '../../../shared/models/diamond-colors';
import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { Offer } from '../../models/offer';
import { MembershipService } from '../../services';
import { Testimonial } from '../../../../models/testimonial';
import { TestimonialService } from '../../../../services';

@Component({
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage extends MetaHelper implements OnInit {
  public widthTypes = HEADER_WIDTH_TYPES;
  public diamondColors = DIAMOND_COLORS;
  public offers: Array<Offer> = [];
  public testimonials: Array<Testimonial> = [];
  public planList = [
    'Daily news update',
    'Industry sponsored webcasts/archive',
    'Open Chapter Meetings',
    'Members-only online Community',
    'Exclusive webcasts/archive',
    'Exclusive articles for Members only',
    'Preferred rates on GARP products/services',
    'Special features and rates on Career Center',
    'GARP-Wiley Bookstore offer',
    'Enhanced search on FRM®; | ERP®; directory',
    'Connect through FRM®; | ERP®; directory',
    'FRM®; | ERP®; digital e-badge',
  ];
  public affiliateCount = 3;
  public individualCount = 9;

  constructor(
    private membershipService: MembershipService,
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

    this.membershipService.getOffers()
      .subscribe(
        offers => this.offers = offers
      );

    this.testimonialService.getTestimonials()
      .subscribe(
        testimonials => this.testimonials = testimonials
      );
  }
}
