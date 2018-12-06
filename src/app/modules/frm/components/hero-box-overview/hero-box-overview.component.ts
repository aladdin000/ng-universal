import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap';

import { HeroBoxOverviewModal } from '../modals/hero-box-overview/hero-box-overview.modal';
import { FAKE_BOOKS } from '../../../shared/models/book';

@Component({
  selector: 'app-frm-hero-box-overview',
  templateUrl: './hero-box-overview.component.html',
  styleUrls: ['./hero-box-overview.component.scss'],
})
export class HeroBoxOverviewComponent implements OnInit {
  public date = new Date();
  public form: FormGroup;

  private modalOptions = new ModalOptions();
  private fakeBooks = FAKE_BOOKS;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur'
      }],
    });

    this.modalOptions.initialState = {
      books: this.fakeBooks,
    };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.get('email').markAsDirty();
      return;
    }

    this.modalService.show(HeroBoxOverviewModal, this.modalOptions);
  }
}
