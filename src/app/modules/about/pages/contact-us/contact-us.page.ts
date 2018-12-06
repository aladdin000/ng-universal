import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';
import { CONTACTS } from '../../models/contact';
import { MetaHelper } from '../../../shared/helpers/meta.helper';

@Component({
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage extends MetaHelper implements OnInit {
  public lineTitleTypes = LINE_TITLE_TYPES;
  public contacts = CONTACTS;

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
