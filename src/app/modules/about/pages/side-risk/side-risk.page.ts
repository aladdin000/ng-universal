import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';
import { MetaHelper } from '../../../shared/helpers/meta.helper';

@Component({
  templateUrl: './side-risk.page.html',
  styleUrls: ['./side-risk.page.scss'],
})
export class SideRiskPage extends MetaHelper implements OnInit {
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