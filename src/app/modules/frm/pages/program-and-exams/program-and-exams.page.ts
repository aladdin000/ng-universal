import { Component } from '@angular/core';

import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';

@Component({
  templateUrl: './program-and-exams.page.html',
  styleUrls: ['./program-and-exams.page.scss'],
})
export class ProgramAndExamsPage {
  public lineTitleTypes = LINE_TITLE_TYPES;
}
