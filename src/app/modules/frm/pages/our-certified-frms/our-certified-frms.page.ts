import { Component, OnInit } from '@angular/core';

import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';
import { MetaHelper } from 'src/app/modules/shared/helpers/meta.helper';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  templateUrl: './our-certified-frms.page.html',
  styleUrls: ['./our-certified-frms.page.scss'],
})
export class OurCertifiedFrmsPage extends MetaHelper implements OnInit {
  public lineTitleTypes = LINE_TITLE_TYPES;

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
