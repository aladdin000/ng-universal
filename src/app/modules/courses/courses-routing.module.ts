import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { COURSES_META } from './courses.meta';

import {
  CoursesPage,
  FoundationPage,
  RiskAndRegulationComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: CoursesPage,
    children: [
      {
        path: 'foundations-of-financial-risk',
        component: FoundationPage,
        data: { meta: COURSES_META.foundation },
      },
      {
        path: 'financial-risk-and-regulation',
        component: RiskAndRegulationComponent,
        data: { meta: COURSES_META.financial },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
