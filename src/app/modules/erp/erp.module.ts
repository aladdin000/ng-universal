import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ErpRoutingModule } from './erp-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GridSliderModule } from '../grid-slider/grid-slider.module';

import {
  ErpPage,
  FeesPaymentsPage,
  OverviewPage,
  ProgramExamsPage,
} from './pages';

import {
  HeroBoxOverviewComponent,
  HeroBoxOverviewModal,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ErpRoutingModule,
    GridSliderModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [
    ErpPage,
    FeesPaymentsPage,
    OverviewPage,
    ProgramExamsPage,
    HeroBoxOverviewComponent,
    HeroBoxOverviewModal,
  ],
  entryComponents: [
    HeroBoxOverviewModal,
  ],
})
export class ErpModule {}
