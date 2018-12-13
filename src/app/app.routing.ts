import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { APP_META } from './app.meta';

import {
  CpdPage,
  HomePage,
  GarpRiskInstitutePage,
  TestimonialDetailPage,
  ExamSitesPage,
} from './pages';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomePage,
    data: { meta: APP_META.home },
  },
  {
    path: 'cpd',
    component: CpdPage,
    data: { meta: APP_META.cpd },
  },
  {
    path: 'exam-sites',
    component: ExamSitesPage,
    data: { meta: APP_META.examSites },
  },
  {
    path: 'garp-risk-institute',
    component: GarpRiskInstitutePage,
    data: { meta: APP_META.riskInstitute },
  },
  {
    path: ':examType/testimonials/:id',
    component: TestimonialDetailPage,
    data: { meta: APP_META.testimonial },
  },
  {
    path: 'frm',
    loadChildren: './modules/frm/frm.module#FrmModule',
  },
  {
    path: 'erp',
    loadChildren: './modules/erp/erp.module#ErpModule',
  },
  {
    path: 'courses',
    loadChildren: './modules/courses/courses.module#CoursesModule',
  },
  {
    path: 'membership',
    loadChildren: './modules/membership/membership.module#MembershipModule',
  },
  {
    path: 'about',
    loadChildren: './modules/about/about.module#AboutModule',
  },
  {
    path: 'risk-intelligence',
    loadChildren: './modules/risk-intelligence/risk-intelligence.module#RiskIntelligenceModule',
  },
  {
    path: 'events',
    loadChildren: './modules/events/events.module#EventsModule',
  },
  {
    path: 'report',
    loadChildren: './modules/report/report.module#ReportModule',
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
