import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MembershipRoutingModule } from './membership-routing.module';
import { SharedModule } from '../shared/shared.module';

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

import {
  CareersHeroBoxComponent,
  NetworkingSectionComponent,
} from './components';

import {
  CareerService,
  ChapterService,
  MembershipService,
} from './services';

@NgModule({
  imports: [
    CommonModule,
    MembershipRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    CareersPage,
    ChapterMeetingDetailPage,
    ChaptersPage,
    IndexPage,
    ListingsPage,
    MembershipPage,
    NetworkingPage,
    SpotlightPage,
    StudentPage,
    CareersHeroBoxComponent,
    NetworkingSectionComponent,
  ],
  providers: [
    CareerService,
    ChapterService,
    MembershipService,
  ],
})
export class MembershipModule {}
