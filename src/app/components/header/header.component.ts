import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ScrollService } from '../../modules/shared/services/scroll.service';
import { HeaderNavigationModalComponent } from '../modals/header-navigation/header-navigation.modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isSearchShowed = false;
  public isHeaderShowed = true;

  private headerLeverPoint = 30;

  constructor(
    private scrollService: ScrollService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.scrollService
      .offsetTop$
      .subscribe(this.scrollHandler)
    ;
  }

  public openMenu(): void {
    this.modalService.show(HeaderNavigationModalComponent);
  }

  private scrollHandler = (offsetTop: number) => {
    if (offsetTop === null) {
      return;
    }

    if (this.isHeaderShowed && offsetTop > this.headerLeverPoint) {
      this.isHeaderShowed = false;
    } else if (offsetTop <= this.headerLeverPoint && !this.isHeaderShowed) {
      this.isHeaderShowed = true;
    }
  }
}
