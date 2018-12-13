import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { SharedModule } from './modules/shared/shared.module';

import { ApiCoreInterceptor } from './api-core.interceptor';

import {
  AppService,
  TestimonialService,
} from './services';

import {
  FooterComponent,
  HeaderComponent,
  HeaderNavigationModalComponent,
} from './components';

import {
  AppPage,
  CpdPage,
  HomePage,
  GarpRiskInstitutePage,
  TestimonialDetailPage,
  ExamSitesPage,
} from './pages';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const pages: any[] = [
  AppPage,
  CpdPage,
  GarpRiskInstitutePage,
  HomePage,
  TestimonialDetailPage,
  ExamSitesPage,
];

const components: any = [
  FooterComponent,
  HeaderComponent,
];

@NgModule({
  declarations: [
    HeaderNavigationModalComponent,
    ...components,
    ...pages,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'app' }),
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    AppService,
    TestimonialService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiCoreInterceptor,
      multi: true,
    },
  ],
  entryComponents: [
    HeaderNavigationModalComponent,
  ],
  bootstrap: [
    AppPage,
  ],
})
export class AppModule {}
