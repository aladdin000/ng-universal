import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { MetaHelper } from '../../../shared/helpers/meta.helper';

@Component({
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage extends MetaHelper implements OnInit {

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
