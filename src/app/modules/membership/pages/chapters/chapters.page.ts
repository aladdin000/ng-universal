import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { ChapterService } from '../../services';
import { Meeting } from '../../models/meeting';

@Component({
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage extends MetaHelper implements OnInit {
  public meetings: Array<Meeting> = [];

  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.chapterService.getMeetings()
      .subscribe(meetings => (
        this.meetings = meetings.sort((a, b) => (
          new Date(a.dateStart) > new Date(b.dateStart) ? 1 : -1
        ))
      ));
  }
}
