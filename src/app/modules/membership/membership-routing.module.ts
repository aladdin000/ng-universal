import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MEMBERSHIP_META } from './membership.meta';

import {
  CareersPage,
  ChapterMeetingDetailPage,
  ChaptersPage,
  IndexPage,
  ListingsPage,
  MembershipPage,
  NetworkingPage,
  SpotlightPage,
  StudentPage,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: MembershipPage,
    children: [
      {
        path: '',
        component: IndexPage,
        data: { meta: MEMBERSHIP_META.index },
      },
      {
        path: 'networking',
        component: NetworkingPage,
        data: { meta: MEMBERSHIP_META.networking },
      },
      {
        path: 'chapters/meetings/:id',
        component: ChapterMeetingDetailPage,
        data: { meta: MEMBERSHIP_META.chapterMeetingDetail },
      },
      {
        path: 'chapters/listings',
        component: ListingsPage,
        data: { meta: MEMBERSHIP_META.listing },
      },
      {
        path: 'chapters',
        component: ChaptersPage,
        data: { meta: MEMBERSHIP_META.chapters },
      },
      {
        path: 'careers',
        component: CareersPage,
        data: { meta: MEMBERSHIP_META.careers },
      },
      {
        path: 'spotlight',
        component: SpotlightPage,
        data: { meta: MEMBERSHIP_META.spotlight },
      },
      {
        path: 'student',
        component: StudentPage,
        data: { meta: MEMBERSHIP_META.student },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipRoutingModule {}
