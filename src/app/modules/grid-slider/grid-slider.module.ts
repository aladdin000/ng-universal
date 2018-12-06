import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import {
  GridSliderComponent,
  GridSlideTextComponent,
  GridSlideVideoComponent,
} from './components';

import {
  VideoModal,
} from './modals';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
  ],
  declarations: [
    GridSliderComponent,
    GridSlideTextComponent,
    GridSlideVideoComponent,
    VideoModal,
  ],
  entryComponents: [
    VideoModal,
  ],
  exports: [
    GridSliderComponent,
  ],
})
export class GridSliderModule {}
