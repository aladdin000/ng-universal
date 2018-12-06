import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EVENTS_META } from './events.meta';

import {
  EventsPage,
  IndexPage,
  EventTypePage,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: EventsPage,
    children: [
      {
        path: '',
        component: IndexPage,
        data: { meta: EVENTS_META.index },
      },
      {
        path: 'in-person',
        component: EventTypePage,
        data: {
          meta: EVENTS_META.person,
          type: 'person',
        },
      },
      {
        path: 'virtual',
        component: EventTypePage,
        data: {
          meta: EVENTS_META.virtual,
          type: 'virtual',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
