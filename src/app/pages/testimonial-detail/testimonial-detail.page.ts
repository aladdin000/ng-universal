import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { MetaHelper } from '../../modules/shared/helpers/meta.helper';
import { TestimonialService } from '../../services';
import { Testimonial } from '../../models/testimonial';
import { TestimonialFaq } from '../../models/testimonial-faq';

@Component({
  templateUrl: './testimonial-detail.page.html',
  styleUrls: ['./testimonial-detail.page.scss'],
})
export class TestimonialDetailPage extends MetaHelper implements OnInit {
  public testimonial: Testimonial;
  public testimonialFAQ: Array<TestimonialFaq>;
  public appLine: {
    title: string,
    type: string,
    color: string,
  };
  public buttonOptions: {
    link: string,
    title: string,
    fragment: string,
  };

  private availableTypes = ['member', 'frm', 'erp'];
  private examType: string;
  private testimonialId: string;

  constructor(
    private testimonialService: TestimonialService,
    private location: Location,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.fetchRouteData();

    if (!this.availableTypes.includes(this.examType)) {
      this.location.back();
    }

    this.testimonialService
      .getTestimonialByTypeAndId(this.examType, this.testimonialId)
      .subscribe(response => {
        this.testimonial = response.testimonial;
        this.testimonialFAQ = response.testimonialFAQ.filter(
          faq => Boolean(faq.name)
        );
      });
  }

  private fetchRouteData(): void {
    this.examType = this.route.snapshot.paramMap.get('examType').toLowerCase();
    this.testimonialId = this.route.snapshot.paramMap.get('id');

    const titleLine = this.examType === 'member'
      ? 'Meet a member'
      : `Meet a certified ${this.examType.toUpperCase()}`;

    const color = this.examType === 'member'
      ? 'dark-purple'
      : 'dark-purple'; // add other colors

    this.appLine = {
      title: titleLine,
      type: this.examType,
      color,
    };

    const btnOpts = { link: null, titleBtn: null, fragment: null };
    if (this.examType === 'member') {
      btnOpts.link = '/membership';
      btnOpts.titleBtn = 'BACK TO MEMBERSHIP OVERVIEW';
      btnOpts.fragment = 'member_quotes';
    } else if (this.examType === 'frm') {
      btnOpts.link = '/frm';
      btnOpts.titleBtn = 'BACK TO FRM OVERVIEW';
      btnOpts.fragment = 'frm_testimonials';
    } else if (this.examType === 'erp') {
      btnOpts.link = '/erp';
      btnOpts.titleBtn = 'BACK TO ERP OVERVIEW';
      btnOpts.fragment = 'erp_testimonials';
    }

    const { link, titleBtn, fragment } = btnOpts;

    this.buttonOptions = {
      link,
      title: titleBtn,
      fragment,
    };
  }
}
