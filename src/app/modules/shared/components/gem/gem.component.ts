import { Component, Input, OnInit } from '@angular/core';

import { GemColorTypes, GemTypes } from '../../models/gem-types';

@Component({
  selector: 'app-gem',
  templateUrl: './gem.component.html',
  styleUrls: ['./gem.component.scss'],
})
export class GemComponent implements OnInit {
  @Input() public type: GemTypes;
  @Input() public colorType: GemColorTypes;
  @Input() public flipX: boolean;
  @Input() public flipY: boolean;

  public style = {
    transform: '',
  };

  ngOnInit() {
    const scaleX = this.flipX ? -1 : 1;
    const scaleY = this.flipY ? -1 : 1;

    this.style.transform = `scale(${scaleX}, ${scaleY})`;
  }
}
