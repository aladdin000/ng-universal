import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICommonAPIResponse } from '../../shared/models/common-api-response';
import { Meeting } from '../models/meeting';
import { Speaker } from '../models/speaker';
import { Chapter } from '../models/chapter';
import { Member } from '../models/member';

interface IMeetingResponse {
  chapterMeeting: ICommonAPIResponse;
  chapterSpeakers: ICommonAPIResponse;
}

interface IChapterResponse {
  chapter: ICommonAPIResponse;
  chapterMembers: ICommonAPIResponse;
}

@Injectable()
export class ChapterService {
  private apiUrl = 'sfdc/chapters';

  constructor(private http: HttpClient) {}

  public getChapters(): Observable<Array<Chapter>> {
    return this.http.get<Array<any>>(this.apiUrl)
      .pipe(
        map(chapters => Chapter.newCollection(Chapter, chapters))
      );
  }

  public getChapter(
    id: string
  ): Observable<{ chapter: Chapter, members: Array<Member> }> {
    return this.http.get<IChapterResponse>(`sfdc/chapter/${id}`)
      .pipe(map(data => {
        const chapter = data.chapter.totalSize
          ? Chapter.new(Chapter, data.chapter.records[0])
          : null;

        const members = Member.newCollection(
          Member, (data.chapterMembers.records || [])
        );

        return { chapter, members };
      }));
  }

  public getMeetings(): Observable<Array<Meeting>> {
    return this.http.get<ICommonAPIResponse>(`${this.apiUrl}/meetings`)
      .pipe(map(data => (
        (data.records || []).map(
          meeting => Meeting.new(Meeting, meeting).defineAdditionalFields()
        )
      )));
  }

  public getMeeting(
    id: string
  ): Observable<{ meeting: Meeting, speakers: Array<Speaker> }> {
    return this.http.get<IMeetingResponse>(`${this.apiUrl}/meetings/${id}`)
      .pipe(map(data => {
        const meeting = data.chapterMeeting.totalSize
          ? Meeting.new(Meeting, data.chapterMeeting.records[0])
          : null;

        const speakers = Speaker.newCollection(
          Speaker, (data.chapterSpeakers.records || [])
        );

        return { meeting, speakers };
      }));
  }
}
