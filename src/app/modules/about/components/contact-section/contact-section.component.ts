import { Component, Input } from '@angular/core';

import { Contact } from '../../models/contact';

@Component({
  selector: 'app-about-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
})
export class ContactSectionComponent {
  @Input() public contact: Contact;
}
