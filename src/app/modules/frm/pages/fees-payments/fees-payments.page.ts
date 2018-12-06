import { Component } from '@angular/core';

import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';

@Component({
  templateUrl: './fees-payments.page.html',
  styleUrls: ['./fees-payments.page.scss'],
})
export class FeesPaymentsPage {
  public lineTitleTypes = LINE_TITLE_TYPES;
}
