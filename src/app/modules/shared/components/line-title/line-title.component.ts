import { Component, Input, OnInit } from '@angular/core';

import { LineTitleTypes } from '../../models/line-title-types';
import { GemColorTypes } from '../../models/gem-types';

@Component({
  selector: 'app-line-title',
  templateUrl: './line-title.component.html',
  styleUrls: ['./line-title.component.scss'],
})
export class LineTitleComponent implements OnInit {
  @Input() public title: string;
  @Input() public type: LineTitleTypes;
  @Input() public gemColor: GemColorTypes;
  @Input() public sizeType: 'md' | 's' | 'xs' = 'md';

  public sizeClass: string;

  ngOnInit() {
    switch (this.sizeType) {
      case 'md':
        this.sizeClass = 'col-xs-4';
        break;
      case 's':
        this.sizeClass = 'col-xs-3';
        break;
      case 'xs':
        this.sizeClass = 'col-xs-3';
        break;
      default:
        this.sizeClass = 'col-xs-4';
    }
  }
}
