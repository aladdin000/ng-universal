import { Directive, Input, Inject, Renderer, ElementRef, HostListener, AfterViewInit } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";

@Directive({
    selector: '[affexScroll]',
})
export class AffexScrollDirective implements AfterViewInit {
    @Input() offset: number;
    private affexed: Boolean = false;
    private currentElPosition;
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private el: ElementRef,
    ) { }

    ngAfterViewInit() {
        this.currentElPosition = this.el.nativeElement.getBoundingClientRect().top - this.offset;
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const windowScroll = window.pageYOffset;
        if (windowScroll > this.currentElPosition) {
            this.renderer.setElementClass(this.el.nativeElement, 'affex-nav', true);
        } else {
            this.renderer.setElementClass(this.el.nativeElement, 'affex-nav', false);
        }
    }
}
