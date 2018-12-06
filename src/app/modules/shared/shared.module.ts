import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { WindowRefProvider } from './providers/window-ref.provider';
import { ScrollService } from './services/scroll.service';

import {
  ConversationComponent,
  GemComponent,
  LineTitleComponent,
  PlanBoxComponent,
  SlideComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
  ],
  declarations: [
    ConversationComponent,
    GemComponent,
    PlanBoxComponent,
    LineTitleComponent,
    SlideComponent,
  ],
  providers: [
    WindowRefProvider,
    ScrollService,
  ],
  exports: [
    CarouselModule,
    ModalModule,
    ConversationComponent,
    GemComponent,
    LineTitleComponent,
    PlanBoxComponent,
    SlideComponent,
  ],
})
export class SharedModule {}