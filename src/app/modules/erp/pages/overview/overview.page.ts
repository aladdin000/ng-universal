import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { HEADER_WIDTH_TYPES } from '../../../shared/models/slide';
import { DIAMOND_COLORS } from '../../../shared/models/diamond-colors';
import { NARIC_COUNTRIES } from '../../../shared/models/naric-countries';
import { FAKE_TESTIMONIALS } from '../../../shared/models/testimonial';
import { MetaHelper } from '../../../shared/helpers/meta.helper';

@Component({
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage extends MetaHelper implements OnInit {
  public widthTypes = HEADER_WIDTH_TYPES;
  public diamondColors = DIAMOND_COLORS;
  public naricCountries = NARIC_COUNTRIES;
  public fakeTestimonials = FAKE_TESTIMONIALS;
  public form: FormGroup;
  public test: FormGroup;
  public isDownloaded = false;

  @ViewChild('realForm') private realForm: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.defineForm();
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    this.isDownloaded = true;
  }

  private defineForm(): void {
    this.form = this.formBuilder.group({
      name: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
        ],
        updateOn: 'blur'
      }],
      surname: [null, {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
        ],
        updateOn: 'blur'
      }],
      email: [null, {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur'
      }],
      company: [null, {
        validators: [Validators.maxLength(255)],
        updateOn: 'blur'
      }],
    });
  }
}
