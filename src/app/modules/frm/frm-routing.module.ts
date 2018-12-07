import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FRM_META } from './frm.meta';

import {
  FrmPage,
  FeesPaymentsPage,
  OverviewPage,
  ProgramAndExamsPage,
  OurCertifiedFrmsPage,
  QuarterPage,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: FrmPage,
    children: [
      {
        path: '',
        component: OverviewPage,
        data: { meta: FRM_META.overview },
      },
      {
        path: 'program-exams',
        component: ProgramAndExamsPage,
        data: { meta: FRM_META.programAndExams },
      },
      {
        path: 'fees-payments',
        component: FeesPaymentsPage,
        data: { meta: FRM_META.feesPayments },
      },
      {
        path: 'our-certified-frms',
        component: OurCertifiedFrmsPage,
        data: { meta: FRM_META.ourCertifiedFrms },
      },
      {
        path: 'our-certified-frms/:id',
        component: QuarterPage,
        data: { meta: FRM_META.ourCertifiedFrms },
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrmRoutingModule {}
