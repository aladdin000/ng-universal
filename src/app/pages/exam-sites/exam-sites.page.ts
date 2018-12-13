import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import { map, flatMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { PageScrollConfig } from 'ngx-page-scroll';

/* Types */
import { LINE_TITLE_TYPES } from '../../modules/shared/models/line-title-types';

/* Helpers */
import { MetaHelper } from 'src/app/modules/shared/helpers/meta.helper';

/* Services */
import { ExamService, UtilitiesService } from '../../services';
import { ExamVenuesService } from '../../services/exam-venues.service';

@Component({
  templateUrl: './exam-sites.page.html',
  styleUrls: ['./exam-sites.page.scss'],
})
export class ExamSitesPage extends MetaHelper implements OnInit {
  public lineTitleTypes = LINE_TITLE_TYPES;
  public examInfo: any;
  public examVenues = {};
  public examRegions = [];
  public activeExamInfo;
  public activeMaterialsExamInfo;
  public activeMaterialsExamYear;
  public nextExamInfo;
  public examDate;

  public activeLink = 0;


  constructor(
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
    private examService: ExamService,
    private examVenuesService: ExamVenuesService,
    private utilitiesService: UtilitiesService,
  ) {
    super(title, meta);
    PageScrollConfig.defaultScrollOffset = 95;
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.examService.getExamInfo()
      .pipe(
        flatMap((examInfo) => {
          this.examInfo = examInfo;
          this.activeExamInfo = this.examInfo[this.examInfo.examRegOpenedMonth];
          this.activeMaterialsExamInfo = this.examInfo[this.examInfo.examMaterialsMonth];
          this.activeMaterialsExamYear = moment(this.activeMaterialsExamInfo.Exam_Date__c).year();
          this.nextExamInfo = this.examInfo[this.examInfo.examRegNextMonth];
          this.examDate = moment(this.activeMaterialsExamInfo.Exam_Date__c).format('LL');
          return forkJoin([
            this.examVenuesService.get(this.examDate),
          ]);
        }),
        flatMap((data) => of(this.examVenuesService.getVenuesByRegion(data[0]))),
        map((response) => this.venueHandler(response))
      )
      .subscribe((examInfo) => {});
  }

  private venueHandler(data) {
    this.examVenues = data;
    _.forEach(this.examVenues, (venue, region) => {
      this.examRegions.push(region);
    });
  }

  public sortVenues(venue) {
    if (this.utilitiesService.defined(venue, 'State__c') && venue.Country__c === 'Canada' || venue.Country__c === 'USA') {
      return venue.Country__c + venue.State__c + venue.City__c;
    } else {
      return venue.Country__c + venue.City__c;
    }
  }

  public formatDate(date, format) {
    return this.utilitiesService.formatDate(date, format);
  }

  public changeActiveLink(id) {
    this.activeLink = id;
  }
}
