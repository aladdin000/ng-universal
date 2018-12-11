import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root',
})
export class StudyTopicsService {
  private apiUrl = 'sfdc/studyTopics';

  constructor(private http: HttpClient,
              private utilitiesService: UtilitiesService) { }

  public getStudyTopics(exam, year) {
    return this.http.get<any>(`${this.apiUrl}/${exam}/${year}`);
  }

}
