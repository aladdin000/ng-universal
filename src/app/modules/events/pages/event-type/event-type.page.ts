import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { GarpTimeHelper } from '../../../shared/helpers/garp-time.helper';
import { EventsService } from '../../services/events.service';
import { Event } from '../../models/event';
import { WindowRefProvider } from '../../../shared/providers/window-ref.provider';
import { isPlatformBrowser } from '@angular/common';

@Component({
  templateUrl: './event-type.page.html',
  styleUrls: ['./event-type.page.scss'],
})
export class EventTypePage extends MetaHelper implements OnInit {
  public pageTitle: string;
  public events: Array<Event> = [];
  public eventLimit = 10;

  private pageType: 'virtual' | 'person';
  private objectTypes: Array<string> = [];

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private winRef: WindowRefProvider,
    @Inject(PLATFORM_ID) private platformId: Object,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.metaData = data.meta;
    this.setMetaData();

    this.pageType = data.type;
    this.defineVariablesBasedOnType();

    if (isPlatformBrowser(this.platformId)) {
      this.winRef.nativeWindow.scroll({
        top: 0,
      });
    }

    this.eventsService.getAggregatedEventsByType(this.objectTypes)
      .subscribe(
        events => {
          this.events = events;
        }
      );
  }

  public navigate(event: Event): void {
    if (event.chapterMeetings) {
      // add navigation - url: '/membership/chapters/meetings/:id',
      // where id = event.chapterMeetings.records[0].Id
    } else if (event.events) {
      if (event.events['records'][0]['RecordTypeId'] === '01240000000Dy2lAAC') { // that recordTypeId is specific for all conventions
        // add navigation - url: '/risk-convention',
      } else {
        // add navigation - url: '/events/:eventName/:docId',
        // where eventName = event.name, docId = event.events.records[0].Id
      }
    } else if (event.webcasts) {
      if (GarpTimeHelper.isAfterDate(event.dateStart)) {
        // add navigation - url: '/risk-intelligence/:category/:subcategory/:docId',
        // where category = 'all', subcategory = 'all', docId = event.id
      } else {
        // add navigation - url: '/webcast/:category/:subcategory/:docId',
        // where category = 'all', subcategory = 'all', docId = event.id
      }
    } else {
      window.open(event.thirdPartyUrl);
    }
  }

  public loadMore(): void {
    this.eventLimit += 10;
  }

  private defineVariablesBasedOnType(): void {
    this.pageTitle = this.pageType === 'virtual'
      ? 'Virtual' : 'In-person';

    this.objectTypes = this.pageType === 'virtual'
      ? ['Webcasts__r']
      : ['Events__r', 'Chapter_Meetings__r'];
  }
}
