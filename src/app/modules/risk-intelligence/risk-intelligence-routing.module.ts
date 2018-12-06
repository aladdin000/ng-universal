import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskIntelligenceComponent } from './risk-intelligence.component';

const routes: Routes = [
  {
    path: '',
    component: RiskIntelligenceComponent,
    children: [
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskIntelligenceRoutingModule {}
