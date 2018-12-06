import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppRoutingModule } from './app.routing';
import { AppModule } from './app.module';
import { AppPage } from './app.page';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule // <-- *Important* to have lazy-loaded routes work
  ],
  bootstrap: [AppPage],
})
export class AppServerModule {}
