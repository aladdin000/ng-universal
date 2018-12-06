import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { MetaHelper } from '../../../shared/helpers/meta.helper';

@Component({
  templateUrl: './foundation.page.html',
  styleUrls: ['./foundation.page.scss'],
})
export class FoundationPage extends MetaHelper implements OnInit {
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
