import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FrmRoutingModule } from './frm-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GridSliderModule } from '../grid-slider/grid-slider.module';

import {
  FeesPaymentsPage,
  FrmPage,
  OverviewPage,
  ProgramAndExamsPage,
  OurCertifiedFrmsPage,
  QuarterPage,
} from './pages';

import {
  HeroBoxOverviewComponent,
  HeroBoxOverviewModal,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    FrmRoutingModule,
    GridSliderModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    FeesPaymentsPage,
    FrmPage,
    OverviewPage,
    ProgramAndExamsPage,
    OurCertifiedFrmsPage,
    QuarterPage,
    HeroBoxOverviewComponent,
    HeroBoxOverviewModal,
  ],
  entryComponents: [
    HeroBoxOverviewModal,
  ],
})
export class FrmModule {}
