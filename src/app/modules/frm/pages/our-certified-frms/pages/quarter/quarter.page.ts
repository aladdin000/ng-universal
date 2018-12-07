import { Component, OnInit } from '@angular/core';

import { MetaHelper } from 'src/app/modules/shared/helpers/meta.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import * as _ from 'lodash';

/* Types */
import { LINE_TITLE_TYPES } from '../../../../../shared/models/line-title-types';

/* Services */
import { CandidateService } from '../../../../../../services/candidates.service';

/* Interfaces */
import { IQuarterData } from './interfaces/quarted-data.interface';
import { Contact } from '../../../../../../models/contact';

@Component({
  templateUrl: './quarter.page.html',
  styleUrls: ['./quarter.page.scss'],
})
export class QuarterPage extends MetaHelper implements OnInit {
  public lineTitleTypes = LINE_TITLE_TYPES;
  public search: string;
  public quarterData = {
    q1: {
      title: '1st quarter 2018',
      startDate: '2017-12-19',
      endDate: '2018-03-17',
      records: [],
    },
    q2: {
      title: '2nd quarter 2018',
      startDate: '2018-03-18',
      endDate: '2018-06-19',
      records: [],
    },
    q3: {
      title: '4th quarter 2017',
      startDate: '2018-06-20',
      endDate: '2018-09-15',
      records: [],
    },
    q4: {
      title: '4th quarter 2017',
      startDate: '2017-09-16',
      endDate: '2017-12-18',
      records: [],
    },
  };

  public currentQuarterData: IQuarterData = <IQuarterData>{};
  public contacts: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    title: Title,
    meta: Meta,
    private candidateService: CandidateService,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    const quarter = this.route.snapshot.params['id'];
    this.currentQuarterData = this.quarterData[quarter];
    if (!this.currentQuarterData) {
      this.router.navigate(['/frm/our-certified-frms']);
      return;
    }

    this.candidateService.getCertifiedCandidatesByType('frm', this.currentQuarterData.startDate, this.currentQuarterData.endDate)
      .subscribe((contacts: Contact[]) => {
        this.currentQuarterData.records = _(contacts)
          .reduce((prev, contact: Contact) => {
            const firstLetterOfLastName = contact.lastName.charAt(0).toLocaleLowerCase();
            prev[firstLetterOfLastName] = prev[firstLetterOfLastName] ? prev[firstLetterOfLastName] : [];
            prev[firstLetterOfLastName] = [...prev[firstLetterOfLastName], contact];
            return prev;
          }, {});

          this.currentQuarterData.records = _.map(this.currentQuarterData.records, (value, key) => {
            return { letter: key, data: value };
          });
          this.contacts = this.currentQuarterData.records;
      });
  }

  public onSearch(event) {
    const value = event.target.value.toLowerCase();
    this.contacts = this.currentQuarterData.records.map((letter: any) => {
      const _letter = Object.assign({}, letter);
      _letter.data = _letter.data.filter((contact) => contact.name.toLowerCase().includes(value));
      return _letter;
    });
  }
}
