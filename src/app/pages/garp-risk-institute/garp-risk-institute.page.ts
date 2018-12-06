import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { MetaHelper } from '../../modules/shared/helpers/meta.helper';

@Component({
  templateUrl: './garp-risk-institute.page.html',
  styleUrls: ['./garp-risk-institute.page.scss'],
})
export class GarpRiskInstitutePage extends MetaHelper implements OnInit {

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
