import { Component, Renderer2 } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

const OPEN_MENU_CLASS = 'open';

@Component({
  templateUrl: './header-navigation.modal.html',
  styleUrls: ['./header-navigation.modal.scss'],
})
export class HeaderNavigationModalComponent {
  private prevMenu: Element;

  constructor(
    private renderer: Renderer2,
    private bsModalRef: BsModalRef,
  ) {}

  public hideModal() {
    this.bsModalRef.hide();
  }

  public onExpandMenu(event: MouseEvent): void {
    const target = event.srcElement.parentElement;
    const isSameMenu = target === this.prevMenu;

    if (isSameMenu) {
      this.toggleMenu();
      return;
    }

    this.resetPrevMenu();

    this.renderer.addClass(target, OPEN_MENU_CLASS);
    this.prevMenu = target;
  }

  private resetPrevMenu(): void {
    if (!this.prevMenu) {
      return;
    }

    this.renderer.removeClass(this.prevMenu, OPEN_MENU_CLASS);
  }

  private toggleMenu(): void {
    const classList = this.prevMenu.classList;

    if (classList.contains(OPEN_MENU_CLASS)) {
      this.renderer.removeClass(this.prevMenu, OPEN_MENU_CLASS);
    } else {
      this.renderer.addClass(this.prevMenu, OPEN_MENU_CLASS);
    }
  }
}
