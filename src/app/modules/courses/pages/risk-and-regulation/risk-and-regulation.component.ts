import { Component, OnInit } from '@angular/core';

import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MetaHelper } from '../../../shared/helpers/meta.helper';

@Component({
  templateUrl: './risk-and-regulation.component.html',
  styleUrls: ['./risk-and-regulation.component.scss'],
})
export class RiskAndRegulationComponent extends MetaHelper implements OnInit {
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
