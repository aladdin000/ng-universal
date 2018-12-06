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
} from './pages';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    // components
    AppPage,
    FooterComponent,
    HeaderComponent,
    // modals
    HeaderNavigationModalComponent,
    // pages
    CpdPage,
    GarpRiskInstitutePage,
    HomePage,
    TestimonialDetailPage,
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
