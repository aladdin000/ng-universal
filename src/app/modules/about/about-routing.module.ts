import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ABOUT_META } from './about.meta';

import {
  AboutPage,
  AboutUsPage,
  AcademicPartnersPageComponent,
  BenchmarkingPage,
  ContactUsPage,
  SideRiskPage,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: AboutPage,
    children: [
      {
        path: '',
        component: AboutUsPage,
        data: { meta: ABOUT_META.aboutUs },
      },
      {
        path: 'garp-global-benchmarking-initiative',
        component: BenchmarkingPage,
        data: { meta: ABOUT_META.benchmarking },
      },
      {
        path: 'buy-side-risk-managers-forum',
        component: SideRiskPage,
        data: { meta: ABOUT_META.sideRisk },
      },
      {
        path: 'academic-partners',
        component: AcademicPartnersPageComponent,
        data: { meta: ABOUT_META.academicPartners },
      },
      {
        path: 'contact-us',
        component: ContactUsPage,
        data: { meta: ABOUT_META.contactUs },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {}
