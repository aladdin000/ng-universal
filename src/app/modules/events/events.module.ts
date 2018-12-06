import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '../shared/shared.module';

import {
  EventsPage,
  IndexPage,
  EventTypePage,
} from './pages';

import {
  EventsService,
} from './services';

@NgModule({
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
  ],
  declarations: [
    EventsPage,
    IndexPage,
    EventTypePage,
  ],
  providers: [
    EventsService,
  ]
})
export class EventsModule {}
