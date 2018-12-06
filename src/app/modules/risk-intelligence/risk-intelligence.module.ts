import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskIntelligenceRoutingModule } from './risk-intelligence-routing.module';

import { RiskIntelligenceComponent } from './risk-intelligence.component';

@NgModule({
  imports: [
    CommonModule,
    RiskIntelligenceRoutingModule,
  ],
  declarations: [
    RiskIntelligenceComponent,
  ],
})
export class RiskIntelligenceModule {}
