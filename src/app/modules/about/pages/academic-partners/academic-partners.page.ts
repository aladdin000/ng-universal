import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { ACADEMICS, IAcademic } from '../../models/academic';
import { AcademicModalComponent } from '../../components/modals/academic/academic.modal';
import { FELLOWS, IFellows } from '../../models/fellows';
import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { AboutService } from '../../services/about.service';

interface ICurrentFellows {
  spring: Array<IFellows>;
  fall: Array<IFellows>;
}

@Component({
  templateUrl: './academic-partners.page.html',
  styleUrls: ['./academic-partners.page.scss'],
})
export class AcademicPartnersPageComponent extends MetaHelper implements OnInit {
  public widthTypes = HEADER_WIDTH_TYPES;
  public fakeAcademics = ACADEMICS;
  public fakeFellows = FELLOWS;
  public fakeYears: Array<number> = [
    2016, 2017, 2018 // TODO: fetch years from fellows data
  ];
  public currentYear: number;
  public currentFellows: ICurrentFellows;

  private modalOptions = new ModalOptions();

  constructor(
    private aboutService: AboutService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.currentYear = this.fakeYears.sort().reverse()[0];
    this.defineCurrentFellows();

    // this.aboutService.getFellows();
  }

  public openModal(academic: IAcademic): void {
    this.modalOptions.initialState = { academic };

    this.modalService.show(AcademicModalComponent, this.modalOptions);
  }

  public changeYear(year: number): void {
    if (year === this.currentYear) {
      return;
    }

    this.currentYear = year;
    this.defineCurrentFellows();
  }

  private defineCurrentFellows(): void {
    this.currentFellows = {
      spring: this.fakeFellows.filter(fellow => (
        fellow.year === this.currentYear && fellow.season === 'SPRING'
      )),
      fall: this.fakeFellows.filter(fellow => (
        fellow.year === this.currentYear && fellow.season === 'FALL'
      )),
    };
  }
}
