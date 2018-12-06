import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { HEADER_WIDTH_TYPES } from '../../modules/shared/models/slide';
import { MetaHelper } from '../../modules/shared/helpers/meta.helper';

@Component({
  templateUrl: './cpd.page.html',
  styleUrls: ['./cpd.page.scss'],
})
export class CpdPage extends MetaHelper implements OnInit {
  public headerWidthTypes = HEADER_WIDTH_TYPES;

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
