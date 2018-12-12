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
  StudyMaterialsPage,
  ReadingsPage,
  ExamPreparationProvidersPage,
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
      },
      {
        path: 'study-materials',
        component: StudyMaterialsPage,
        data: { meta: FRM_META.studyMaterials },
      },
      {
        path: 'readings/:id',
        component: ReadingsPage,
        data: { meta: FRM_META.readings },
      },
      {
        path: 'exam-preparation-providers',
        component: ExamPreparationProvidersPage,
        data: { meta: FRM_META.examPreparationProviders },
      },
      {
        path: 'exam-preparation-providers/:id',
        component: ExamPreparationProvidersPage,
        data: { meta: FRM_META.examPreparationProviders },
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrmRoutingModule {}
