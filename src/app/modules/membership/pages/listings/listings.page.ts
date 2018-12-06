import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { Chapter } from '../../models/chapter';
import { ChapterService } from '../../services';
import { Member } from '../../models/member';

@Component({
  templateUrl: './listings.page.html',
  styleUrls: ['./listings.page.scss'],
})
export class ListingsPage extends MetaHelper implements OnInit {
  public africaChapters: Array<Chapter> = [];
  public americasChapters: Array<Chapter> = [];
  public oceaniaChapters: Array<Chapter> = [];
  public eastChapters: Array<Chapter> = [];
  public europeChapters: Array<Chapter> = [];
  public openedIdChapters: Array<string> = [];

  private allChapters: Array<Chapter> = [];

  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.chapterService.getChapters()
      .subscribe(chapters => {
        this.allChapters = chapters.sort(
          (a, b) => a.name > b.name ? 1 : -1
        );
        this.filterChapters();
      });
  }

  public toggleId(id: string): void {
    if (this.openedIdChapters.includes(id)) {
      const index = this.openedIdChapters.findIndex(val => val === id);
      this.openedIdChapters.splice(index, 1);
    } else {
      this.openedIdChapters.push(id);
    }
  }

  public hasDirector(members: Array<Member>): boolean {
    return Boolean(members.find(member => member.isDirector));
  }

  public hasCommitteeMembers(members: Array<Member>): boolean {
    return Boolean(members.find(member => member.isCommitteeMember));
  }

  private filterChapters(): void {
    this.africaChapters = this.allChapters.filter(
      chapter => chapter.region && chapter.region.match(/^Africa/)
    );

    this.americasChapters = this.allChapters.filter(
      chapter => chapter.region && chapter.region.match(/^Americas/)
    );

    this.oceaniaChapters = this.allChapters.filter(
      chapter => chapter.region && (
        chapter.region.match(/^Asia/) || chapter.region.match(/^Oceania/)
      )
    );

    this.eastChapters = this.allChapters.filter(
      chapter => chapter.region && chapter.region.match(/^Middle/)
    );

    this.europeChapters = this.allChapters.filter(
      chapter => chapter.region && chapter.region.match(/^Europe/)
    );
  }
}
