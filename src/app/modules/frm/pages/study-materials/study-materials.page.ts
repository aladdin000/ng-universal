import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { of, forkJoin } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import * as _ from 'lodash';

/* Types */
import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';

/* Helpers */
import { MetaHelper } from 'src/app/modules/shared/helpers/meta.helper';

/* Services */
import { ExamService, IExamInfo, UtilitiesService, StudyMaterialsService, StudyTopicsService } from '../../../../services';
import { ExamMonth } from 'src/app/modules/shared/enums/exam-month.enum';
import { LINKS } from '../../../shared/enums/links.enum';
import { EXAM_TYPE } from 'src/app/modules/shared/enums/exam-type.enum';

@Component({
  templateUrl: './study-materials.page.html',
  styleUrls: ['./study-materials.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudyMaterialsPage extends MetaHelper implements OnInit {
  public lineTitleTypes = LINE_TITLE_TYPES;
  public examInfo: any;
  public activeMaterialsExamInfo: any;
  public activeMaterialsExamYear: any;
  public exam = EXAM_TYPE.FRM;
  public showStudyModuleLeadGen: any;
  public showFreeReadingLeadGen: any;
  public studyGuides: any;
  public books: any[];
  public eBooks: any[];
  public practiceExams: any[];
  public isNearStudyMaterialsEndOfLife: any;
  public nextActiveMaterialsExamInfo: any;
  public nextActiveMaterialsExamYear: any;
  public learningObjectives: any;
  public deepLink;


  constructor(
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
    private examService: ExamService,
    private utilitiesService: UtilitiesService,
    private studyMaterialsService: StudyMaterialsService,
    private studyTopicsService: StudyTopicsService,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();
    this.examService.getExamInfo()
      .pipe(
        flatMap(examInfo => this.makeStudyMaterialCall(examInfo)),
        flatMap(response => this.initStudyMaterials(response)),
        flatMap(response => this.getNextMaterialsIfCurrentIsEndOfLife(response)),
        flatMap(response => this.initNextActiveStudyMaterials(response)),
      )
      .subscribe((examInfo: any) => {
        console.log(this.learningObjectives);
      }, (err) => console.log(err));

    this.deepLink = `https://${LINKS.DEEP_LINK}/Login?start=`;
  }

  private makeStudyMaterialCall(examInfoResponse) {
    if (this.utilitiesService.defined(examInfoResponse, 'examMaterialsMonth')) {
      this.examInfo = examInfoResponse;
      this.activeMaterialsExamInfo = this.examInfo[this.examInfo.examMaterialsMonth];
      this.activeMaterialsExamYear = moment(this.activeMaterialsExamInfo.Exam_Date__c).year();
      const studyProductsFolderId = this.activeMaterialsExamInfo[`${this.exam.toUpperCase()}_Study_Materials_Folder__c`];
      return forkJoin(
        this.studyMaterialsService.getStudyMaterials(studyProductsFolderId),
        this.studyTopicsService.getStudyTopics(`${this.exam.toUpperCase()} Exam Part I`, this.activeMaterialsExamYear),
        this.studyTopicsService.getStudyTopics(`${this.exam.toUpperCase()} Exam Part II`, this.activeMaterialsExamYear),
      );
    }
  }

  private initStudyMaterials(responses) {
    const response = responses[0];
    this.showStudyModuleLeadGen = response.showStudyModuleLeadGen;
    this.showFreeReadingLeadGen = response.showFreeReadingLeadGen;
    this.studyGuides = response.studyGuides;
    this.books = response.books;
    this.eBooks = response.eBooks;
    this.practiceExams = response.practiceExams;
    this.learningObjectives = response.learningObjectives;

    this.showStudyModuleLeadGen = this.studyMaterialsService.showStudyModuleLeadGen(this.exam, this.activeMaterialsExamInfo);
    this.showFreeReadingLeadGen = this.studyMaterialsService.showFreeReadingLeadGen(this.exam, this.activeMaterialsExamInfo);

    this.createGaLabels(this.studyGuides, 'Changes', 'studygchanges', 'studyg');
    this.createGaLabels(this.books, 'Part II', 'pt2books', 'pt1books');
    this.createGaLabels(this.eBooks, 'Part II', 'pt2ebooks', 'pt1ebooks');
    this.createGaLabels(this.practiceExams, 'Part II', 'pt2practiceexam', 'pt1practiceexam');

    return of(responses);
  }

  private getNextMaterialsIfCurrentIsEndOfLife(responses) {
    this.isNearStudyMaterialsEndOfLife = this.examService.areCurrentStudyMaterialsNearEndOfLife(this.examInfo);
    if (this.isNearStudyMaterialsEndOfLife) {
      this.nextActiveMaterialsExamInfo = this.examInfo[ExamMonth.MAY];
      this.nextActiveMaterialsExamYear = moment(this.nextActiveMaterialsExamInfo.Exam_Date__c).year();
      const nextActiveStudyProductsFolderId = this.nextActiveMaterialsExamInfo[`${this.exam.toUpperCase()}_Study_Materials_Folder__c`];
      return of(this.studyMaterialsService.getStudyMaterials(nextActiveStudyProductsFolderId));
    }
    return of(responses);
  }

  private initNextActiveStudyMaterials(nextMaterialsResponse) {
    try {
      if (this.isNearStudyMaterialsEndOfLife && this.utilitiesService.defined(nextMaterialsResponse)) {
        this.learningObjectives.nextActiveItem = nextMaterialsResponse.learningObjectives;
        this.studyGuides = this.attachNextActiveItems(this.studyGuides, nextMaterialsResponse.studyGuides, 'Changes');
        this.books = this.attachNextActiveItems(this.books, nextMaterialsResponse.books, 'Part II');
        this.eBooks = this.attachNextActiveItems(this.eBooks, nextMaterialsResponse.eBooks, 'Part II');
        this.practiceExams = this.attachNextActiveItems(this.practiceExams, nextMaterialsResponse.practiceExams, 'Part II');

        this.createGaLabels(this.studyGuides, 'Changes', 'studygchanges', 'studyg');
        this.createGaLabels(this.books, 'Part II', 'pt2books', 'pt1books');
        this.createGaLabels(this.eBooks, 'Part II', 'pt2ebooks', 'pt1ebooks');
        this.createGaLabels(this.practiceExams, 'Part II', 'pt2practiceexam', 'pt1practiceexam');
      }
    } catch (e) {
      console.log('Error in initNextActiveStudyMaterials: ', e);
    } finally {
      return of(nextMaterialsResponse);
    }
  }

  private attachNextActiveItems(activeItems, nextActiveItems, secondItemQuery) {
    try {
      const returnObj = [];
      const currentItemTwoIndex = _.findIndex(activeItems, (item: any) => {
        return item.Name.indexOf(secondItemQuery) > -1;

      });

      const nextItemTwoIndex = _.findIndex(nextActiveItems, (item: any) => {
        return item.Name.indexOf(secondItemQuery) > -1;
      });

      const currentItemOneIndex = (currentItemTwoIndex === 0) ? 1 : 0;
      const nextItemOneIndex = (nextItemTwoIndex === 0) ? 1 : 0;

      returnObj[currentItemOneIndex] = activeItems[currentItemOneIndex];
      returnObj[currentItemTwoIndex] = activeItems[currentItemTwoIndex];
      returnObj[currentItemTwoIndex].nextActiveItem = nextActiveItems[nextItemTwoIndex];
      returnObj[currentItemOneIndex].nextActiveItem = nextActiveItems[nextItemOneIndex];

      return returnObj;
    } catch (e) {
      console.log('Error in attachNextActiveItems', e);
    }
  }

  public getFreeReadingsLeadGenUrl(examInfo) {
    if (!this.utilitiesService.defined(examInfo)) {
      return '';
    }

    return (this.exam === EXAM_TYPE.FRM) ?
      examInfo.FRM_Free_Reading_Lead_Gen_URL__c :
      examInfo.ERP_Free_Reading_Lead_Gen_URL__c;
  }

  public getModulesLeadGenUrl(examInfo) {
    if (!this.utilitiesService.defined(examInfo)) {
      return '';
    }

    return (this.exam === EXAM_TYPE.FRM) ?
      examInfo.FRM_Study_Module_Lead_Gen_URL__c :
      examInfo.ERP_Study_Module_Lead_Gen_URL__c;
  }

  private createGaLabels(scope, keyword, labelone, labeltwo) {
    for (let i = 0; i < scope.length; i++) {
      if (scope[i].Name.indexOf(keyword) > -1) {
        scope[i].gaLabel = labelone;
      } else {
        scope[i].gaLabel = labeltwo;
      }
    }
  }

  public isBeforeDate(dateString) {
    return this.utilitiesService.isBeforeDate(dateString);
  }

  public isAfterDate(dateString) {
    return this.utilitiesService.isAfterDate(dateString);
  }

  public isProductAvailable(item) {
    return this.studyMaterialsService.isProductAvailable(item);
  }

  public isProductComingSoonPeriod(item) {
    return this.studyMaterialsService.isProductComingSoonPeriod(item);
  }

  public isProductOutOfStock(item) {
    return this.studyMaterialsService.isProductOutOfStock(item);
  }

  public isProductDigital(item) {
    return this.studyMaterialsService.isProductDigital(item);
  }

  public isProductPreorderPeriod(item) {
    return this.studyMaterialsService.isProductPreorderPeriod(item);
  }

  public isPlural(str) {
    if (!this.utilitiesService.defined(str) || typeof str !== 'string') {
      return false;
    }

    return str.slice(-1) === 's';
  }
}
