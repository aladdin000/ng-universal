import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '../shared/shared.module';

import {
  HeroBoxComponent,
  FaqComponent,
} from './components';

import {
  CoursesPage,
  FoundationPage,
  RiskAndRegulationComponent,
} from './pages';

@NgModule({
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
  ],
  declarations: [
    CoursesPage,
    FoundationPage,
    RiskAndRegulationComponent,
    HeroBoxComponent,
    FaqComponent,
  ],
})
export class CoursesModule {}
