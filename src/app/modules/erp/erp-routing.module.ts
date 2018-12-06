import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ERP_META } from './erp.meta';

import {
  ErpPage,
  FeesPaymentsPage,
  OverviewPage,
  ProgramExamsPage,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: ErpPage,
    children: [
      {
        path: '',
        component: OverviewPage,
        data: { meta: ERP_META.overview },
      },
      {
        path: 'program-exams',
        component: ProgramExamsPage,
        data: { meta: ERP_META.programExams },
      },
      {
        path: 'fees-payments',
        component: FeesPaymentsPage,
        data: { meta: ERP_META.feesPayments },
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErpRoutingModule {}
