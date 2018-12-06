import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { EventsService } from '../../services';
import { Event } from '../../models/event';

@Component({
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage extends MetaHelper implements OnInit {
  public widthTypes = HEADER_WIDTH_TYPES;
  public events: Array<Event> = [];

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.eventsService.getAggregatedEvents()
      .subscribe(
        events => this.events = events
      );
  }
}
