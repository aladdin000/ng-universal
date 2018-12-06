import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { WindowRefProvider } from '../../../shared/providers/window-ref.provider';

@Component({
  selector: 'app-careers-hero-box',
  templateUrl: './careers-hero-box.component.html',
  styleUrls: ['./careers-hero-box.component.scss'],
})
export class CareersHeroBoxComponent implements OnInit {
  @Input() private formSubmitter: Subject<void>;

  public form: FormGroup;

  private searchUrl = 'https://www.onewire.com/Partner/SearchJobsOnly?SortBy=RELEVANCE&cp=17&From=0&Size=50&s=';
  private subs = new Subscription();

  constructor(
    private winRef: WindowRefProvider,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.defineForm();

    this.subs.add(
      this.formSubmitter
        .asObservable()
        .subscribe(
          () => this.onSubmit()
        )
    );
  }

  public onSubmit(): void {
    let url = this.searchUrl;

    if (this.form.value.company) {
      url += '&kw=' + this.form.value.company;
    }

    if (this.form.value.address) {
      url += '&cityId=' + this.form.value.company;
    }

    this.winRef.nativeWindow.open(url, '_new');
  }

  private defineForm(): void {
    this.form = this.formBuilder.group({
      company: [null],
      address: [null],
    });
  }
}
