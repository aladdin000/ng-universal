import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { IAcademic } from '../../../models/academic';

@Component({
  templateUrl: './academic.modal.html',
  styleUrls: ['./academic.modal.scss'],
})
export class AcademicModalComponent {
  public academic: IAcademic;

  constructor(public bsModalRef: BsModalRef) {}
}
