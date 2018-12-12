import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { map, flatMap } from 'rxjs/operators';
import * as moment from 'moment';
import { forkJoin, of } from 'rxjs';
import * as _ from 'lodash';

import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { DIAMOND_COLORS } from '../../../shared/models/diamond-colors';
import { NARIC_COUNTRIES } from '../../../shared/models/naric-countries';
import { FAKE_TESTIMONIALS, IFakeTestimonial } from '../../../shared/models/testimonial';

/* Helpers */
import { MetaHelper } from '../../../shared/helpers/meta.helper';

/* Types */
import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';
import { EXAM_TYPE } from '../../../shared/enums/exam-type.enum';

/* Services */
import { ExamService, UtilitiesService, StudyMaterialsService, StudyTopicsService } from '../../../../services';

@Component({
    templateUrl: './readings.page.html',
    styleUrls: ['./readings.page.scss'],
})
export class ReadingsPage extends MetaHelper implements OnInit {
    public lineTitleTypes = LINE_TITLE_TYPES;
    public exam = EXAM_TYPE.FRM;
    public examInfo: any;
    public activeMaterialsExamInfo: any;
    public activeMaterialsExamYear: any;
    public showFreeReadingLeadGen: any;
    public readings: any;
    public readingType;
    public requared;


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
        this.readingType = this.route.snapshot.params['id'];
        this.requared = this.readingType === 'required' ? true : false;

        this.examService.getExamInfo()
            .pipe(
                flatMap(examInfo => this.makeStudyTopicCall(examInfo)),
                flatMap(response => this.resolvePromises(response)),
                flatMap(response => this.filter(response)),
            )
            .subscribe((examInfo: any) => {console.log(examInfo)}, (err) => console.log(err));
    }

    private makeStudyTopicCall(examInfoResponse) {
        if (this.utilitiesService.defined(examInfoResponse, 'examMaterialsMonth')) {
            this.examInfo = examInfoResponse;
            this.activeMaterialsExamInfo = this.examInfo[this.examInfo.examMaterialsMonth];
            this.activeMaterialsExamYear = moment(this.activeMaterialsExamInfo.Exam_Date__c).year();
            this.showFreeReadingLeadGen = this.studyMaterialsService.showFreeReadingLeadGen(this.exam, this.activeMaterialsExamInfo);

            return forkJoin([
                this.studyTopicsService.getStudyTopics(this.exam + '%20Exam%20Part%20I', this.activeMaterialsExamYear),
                this.studyTopicsService.getStudyTopics(this.exam + '%20Exam%20Part%20II', this.activeMaterialsExamYear),
            ]);
        }
    }

    private resolvePromises(responses) {
        this.readings = [];
        for (let i = 0; i < responses.length; i++) {
            if (this.utilitiesService.defined(responses[i], 'records')) {
                const readingsByDomain = this.getReadings(responses[i].records);
                if (_.isEmpty(readingsByDomain)) {
                    readingsByDomain.hasReadings = false;
                } else {
                    readingsByDomain.hasReadings = true;
                }
                this.readings[i] = readingsByDomain;
            }
        }

        return this.readings;
    }

    private getReadings(readingsByWeeks): any {
        // Get all the online readings
        let examReadings = [];
        readingsByWeeks.forEach(function(week) {
            if (_.has(week, 'Study_Guide_Readings__r') && _.has(week.Study_Guide_Readings__r, 'records')) {
                const thisWeeksOnlineReadings = _.filter(week.Study_Guide_Readings__r.records, function(reading) {
                    return reading.Is_Online__c;
                });
                examReadings = examReadings.concat(thisWeeksOnlineReadings);
            }
        });

        if (examReadings.length < 1) {
            return [];
        }

        // Let's sort those by Domain
        const examReadingsByDomain: any = {};
        examReadings.forEach(function(reading) {
            if (_.has(reading, 'Study_Guide_Domain__r') && _.has(reading.Study_Guide_Domain__r, 'Name')) {
                if (!_.has(examReadingsByDomain, reading.Study_Guide_Domain__r.Name)) {
                    examReadingsByDomain[reading.Study_Guide_Domain__r.Name] = {};
                    examReadingsByDomain[reading.Study_Guide_Domain__r.Name].domainName = reading.Study_Guide_Domain__r.Name;
                    examReadingsByDomain[reading.Study_Guide_Domain__r.Name].ID__c = reading.Study_Guide_Domain__r.ID__c;
                    examReadingsByDomain[reading.Study_Guide_Domain__r.Name].readings = [];
                }
                examReadingsByDomain[reading.Study_Guide_Domain__r.Name].readings.push(reading);
            }
        });
        return examReadingsByDomain;
    }

    public filter(items) {
        console.log(this.readings);
        this.readings = _(items)
            .map((item, key) => {
                if (typeof item === 'object') {
                    const isRequired = _.get(item, 'readings[0].Required__c') || false;
                    item.isRequired = isRequired;
                }
                return item;
            })
            .filter((item) => {
                // console.log(item,);
                return _.get(item, 'isRequired') || false;
            })
            .value();
        return of(filtered[0]);
    }

    public getExamPart(index) {
        return (index === 0) ? 'I' : 'II';
    }

    public isOptionalReading(reading) {
        if (this.utilitiesService.defined(reading, 'Study_Guide_Readings_Group__r.Optional_Readings__c')) {
            return reading.Study_Guide_Readings_Group__r.Optional_Readings__c;
        } else {
            return false;
        }
    }
}
