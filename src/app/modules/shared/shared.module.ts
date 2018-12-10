import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { WindowRefProvider } from './providers/window-ref.provider';
import { ScrollService } from './services/scroll.service';

import { AffexScrollDirective } from './directives/affex-scroll.directive';

import {
  ConversationComponent,
  GemComponent,
  LineTitleComponent,
  PlanBoxComponent,
  SlideComponent,
  PriceBoxComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    NgxPageScrollModule,
  ],
  declarations: [
    ConversationComponent,
    GemComponent,
    PlanBoxComponent,
    LineTitleComponent,
    SlideComponent,
    PriceBoxComponent,
    AffexScrollDirective,
  ],
  providers: [
    WindowRefProvider,
    ScrollService,
  ],
  exports: [
    CarouselModule,
    ModalModule,
    NgxPageScrollModule,
    ConversationComponent,
    GemComponent,
    LineTitleComponent,
    PlanBoxComponent,
    SlideComponent,
    PriceBoxComponent,
    AffexScrollDirective,
  ],
})
export class SharedModule {}
