import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-courses-hero-box',
  templateUrl: './hero-box.component.html',
  styleUrls: ['./hero-box.component.scss'],
})
export class HeroBoxComponent {
  @Input() public title: string;
  @Input() public secondaryTitle: string;
  @Input() public text: string;
}
