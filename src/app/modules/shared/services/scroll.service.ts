import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';

import { WindowRefProvider } from '../providers/window-ref.provider';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ScrollService {
  public offsetTop$: Observable<number>;

  private renderer: Renderer2;
  private offsetTop = new BehaviorSubject<number>(null);

  constructor(
    private winRef: WindowRefProvider,
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.offsetTop$ = this.offsetTop.asObservable();

    if (isPlatformBrowser(this.platformId)) {
      this.initScrollHandler();
    }
  }

  private initScrollHandler(): void {
    this.renderer.listen(
      this.winRef.nativeWindow.document,
      'scroll',
      () => this.offsetTop.next(
        this.winRef.nativeWindow.pageYOffset
      ),
    );
  }
}
