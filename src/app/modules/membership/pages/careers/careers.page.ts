import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { JOBS } from '../../models/job';
import { CURATED_CONTENTS } from '../../models/curated-content';
import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { CareerService } from '../../services';

@Component({
  templateUrl: './careers.page.html',
  styleUrls: ['./careers.page.scss'],
})
export class CareersPage extends MetaHelper implements OnInit {
  @ViewChild('hiringSection') private hiringSection: ElementRef;

  public fakeJobs = JOBS;
  public fakeCuratedContents = CURATED_CONTENTS;
  public jobSearcher = new Subject<void>();

  constructor(
    private careerService: CareerService,
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

  public searchJob(): void {
    this.jobSearcher.next();
  }

  public onSlideButtonClick(): void {
    (<Element>this.hiringSection.nativeElement).scrollIntoView({
      behavior: 'smooth',
    });
  }
}
