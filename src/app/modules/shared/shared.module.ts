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

import { OrderByPipe } from './pipes';

const directives: any[] = [
  AffexScrollDirective,
];

const pipes: any[] = [
  OrderByPipe,
];

const components: any[] = [
  ConversationComponent,
  GemComponent,
  LineTitleComponent,
  PlanBoxComponent,
  SlideComponent,
  PriceBoxComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    NgxPageScrollModule,
  ],
  declarations: [
    ...components,
    ...directives,
    ...pipes,
  ],
  providers: [
    WindowRefProvider,
    ScrollService,
  ],
  exports: [
    CarouselModule,
    ModalModule,
    NgxPageScrollModule,
    ...components,
    ...directives,
    ...pipes,
  ],
})
export class SharedModule {}
