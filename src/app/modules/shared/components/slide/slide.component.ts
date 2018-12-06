import {
  Component, Input, OnInit, ViewChild,
  ElementRef, Renderer2, TemplateRef, Output, EventEmitter,
} from '@angular/core';

import { HeaderWidth } from '../../models/slide';

@Component({
  selector: 'app-slide',
  templateUrl: 'slide.component.html',
  styleUrls: ['slide.component.scss'],
})
export class SlideComponent implements OnInit {
  @ViewChild('section') private section: ElementRef;

  @Input() public imageUrl: string;
  @Input() public header?: string;
  @Input() public headerWidth?: HeaderWidth = 'full';
  @Input() public subHeader?: string;
  @Input() public subHeaderWidth?: HeaderWidth;
  @Input() public text?: string;
  @Input() public textWidth?: HeaderWidth;
  @Input() public button?: string;
  @Input() public subButton?: string;
  @Input() public reverseAngle?: boolean;
  @Input() public underButton?: TemplateRef<Element>;
  @Input() public gem?: TemplateRef<Element>;
  @Input() public box?: TemplateRef<Element>;

  @Output('buttonClick') private buttonClick = new EventEmitter<void>();

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(
      this.section.nativeElement,
      'background-image',
      `url("${this.imageUrl}")`
    );
  }

  public onButtonClick(): void {
    this.buttonClick.emit();
  }
}
