import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  templateUrl: './video.modal.html',
  styles: [`
    .modal-body {
      height: 340px;
    }

    .modal-body iframe {
      width: 100%;
      height: 100%;
    }
  `],
})
export class VideoModal implements OnInit {
  /* Initial State */
  public title: string;
  public video: string;

  public safeVideoUrl: SafeUrl;

  constructor(
    public bsModalRef: BsModalRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.video
    );
  }
}
