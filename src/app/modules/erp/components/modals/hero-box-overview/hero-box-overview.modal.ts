import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

import { IBook } from '../../../../shared/models/book';

@Component({
  templateUrl: './hero-box-overview.modal.html',
  styleUrls: ['./hero-box-overview.modal.scss'],
})
export class HeroBoxOverviewModal {
  public books: Array<IBook> = [];

  constructor(public bsModalRef: BsModalRef) {}
}
