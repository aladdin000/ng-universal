import { Component, OnInit } from '@angular/core';

import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MetaHelper } from 'src/app/modules/shared/helpers/meta.helper';

@Component({
  templateUrl: './fees-payments.page.html',
  styleUrls: ['./fees-payments.page.scss'],
})
export class FeesPaymentsPage extends MetaHelper implements OnInit {
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
