import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { some } from 'lodash';

import { MetaHelper } from '../../../shared/helpers/meta.helper';
import { Meeting } from '../../models/meeting';
import { ChapterService } from '../../services';
import { Speaker } from '../../models/speaker';
import { Chapter } from '../../models/chapter';
import { Member } from '../../models/member';
import { GarpTimeHelper } from '../../../shared/helpers/garp-time.helper';

@Component({
  templateUrl: './chapter-meeting-detail.page.html',
  styleUrls: ['./chapter-meeting-detail.page.scss'],
})
export class ChapterMeetingDetailPage extends MetaHelper implements OnInit {
  public meeting: Meeting;
  public chapter: Chapter;
  public members: Array<Member> = [];
  public speakers: Array<Speaker> = [];
  public dateFormatter = GarpTimeHelper.formatEastern;
  public hasDirectors: boolean;
  public hasComMembers: boolean; // some($scope.chapterMembers,{'Committee_Member__c':true});

  private meetingId: string;

  constructor(
    public sanitizer: DomSanitizer,
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    title: Title,
    meta: Meta,
  ) {
    super(title, meta);
  }

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id');
    this.metaData = this.route.snapshot.data.meta;
    this.setMetaData();

    this.chapterService.getMeeting(this.meetingId)
      .subscribe(response => {
        this.meeting = response.meeting;
        this.speakers = response.speakers;

        this.chapterService.getChapter(this.meeting.chapter.id)
          .subscribe(response => {
            this.chapter = response.chapter;
            this.members = response.members;

            this.hasDirectors = some(this.members, { 'isDirector': true });
            this.hasComMembers = some(this.members, { 'isCommitteeMember': true });
          });
      });
  }

  public getFilteredMembers(fieldName: string): Array<Member> {
    return this.members.filter(member => Boolean(member[fieldName]));
  }
}
