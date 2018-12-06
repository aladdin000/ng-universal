import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <div class="wrapper">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .wrapper {
      padding-top: 104px;
    }


    @media (max-width: 768px) {
      .wrapper {
        padding-top: 65px;
      }
    }
  `]
})
export class AppPage {
}
