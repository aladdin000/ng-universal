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
  StudyMaterialsPage,
  ReadingsPage,
  ExamPreparationProvidersPage,
} from './pages';

import {
  HeroBoxOverviewComponent,
  HeroBoxOverviewModal,
} from './components';

const pages: any[] = [
  FeesPaymentsPage,
  FrmPage,
  OverviewPage,
  ProgramAndExamsPage,
  OurCertifiedFrmsPage,
  QuarterPage,
  StudyMaterialsPage,
  ReadingsPage,
  ExamPreparationProvidersPage,
];

const components: any[] = [
  HeroBoxOverviewComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FrmRoutingModule,
    GridSliderModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ...pages,
    ...components,
    HeroBoxOverviewModal,
  ],
  entryComponents: [
    HeroBoxOverviewModal,
  ],
})
export class FrmModule {}
