import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { SharedModule } from '../shared/shared.module';

import {
  AboutPage,
  AboutUsPage,
  AcademicPartnersPageComponent,
  BenchmarkingPage,
  ContactUsPage,
  SideRiskPage,
} from './pages';

import {
  AcademicModalComponent,
  ContactSectionComponent,
  HeroBoxAboutComponent,
  HeroBoxGbiComponent,
} from './components';

import {
  AboutService,
} from './services';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
  ],
  declarations: [
    AboutPage,
    AboutUsPage,
    AcademicPartnersPageComponent,
    BenchmarkingPage,
    ContactUsPage,
    SideRiskPage,
    ContactSectionComponent,
    HeroBoxAboutComponent,
    HeroBoxGbiComponent,
    AcademicModalComponent,
  ],
  entryComponents: [
    AcademicModalComponent,
  ],
  providers: [
    AboutService,
  ],
})
export class AboutModule {}
