import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

/* Helpers */
import { MetaHelper } from 'src/app/modules/shared/helpers/meta.helper';

/* Types */
import { LINE_TITLE_TYPES } from '../../../shared/models/line-title-types';

/* Services */
import { EppService } from 'src/app/services/epp.service';

/* Models */
import { EPP } from 'src/app/models/epp';


@Component({
  templateUrl: './exam-preparation-providers.page.html',
  styleUrls: ['./exam-preparation-providers.page.scss'],
})
export class ExamPreparationProvidersPage extends MetaHelper implements OnInit {
  public lineTitleTypes = LINE_TITLE_TYPES;
  public epps: EPP[];
  public param;
  public activeEPP: EPP;

  constructor(
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
    private eppService: EppService,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.param = this.route.snapshot.params['id'];

    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.eppService.get()
        .subscribe(
          (epps: EPP[]) => {
            this.epps = epps
            .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
                return 0;
            })
            .map((item: any) => {
              item.link = this.convertNameToLink(item.name);
              return item;
            });

            if (this.param) {
              this.activeEPP = this.epps.find((item: any) => item.link === this.param);
            }
          }
        );
  }

  convertNameToLink(name) {
    name = name.replace(/[\W_]+/g, '-');

    if (name[0] === '-')  {
      name = name.slice(1, name.length);
    }

    if (name[name.length - 1] === '-')  {
      name = name.slice(0, name.length - 1);
    }

    return name;
  }

  parseLogo(src) {
    return src.includes('http') ? this.activeEPP.logo : `../../../../../assets/images/${this.activeEPP.logo}`;
  }
}
