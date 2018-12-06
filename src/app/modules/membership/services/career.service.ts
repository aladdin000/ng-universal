import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ICommonAPIResponse } from '../../shared/models/common-api-response';
import { Internship } from '../models/internship';
import { map } from 'rxjs/operators';

@Injectable()
export class CareerService {
  private apiUrl = 'sfdc/careercenter';

  constructor(private http: HttpClient) {}

  /* the response is empty, cant make model for data */
  public getJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/highlighted`);
  }

  public getInternships(): Observable<Array<Internship>> {
    return this.http.get<ICommonAPIResponse>(`${this.apiUrl}/allinternships`)
      .pipe(
        map(data => Internship.newCollection(Internship, data.records))
      );
  }

  /* the response is pending all the time */
  public getHihglitedontent(): Observable<any> {
    return this.http.get(`${this.apiUrl}/content/highlighted`);
  }
}
