import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { UtilitiesService } from './utilities.service';
import { Observable } from 'rxjs';
import { ICommonAPIResponse } from '../modules/shared/models/common-api-response';
import { EPP } from '../models/epp';

@Injectable({
  providedIn: 'root',
})
export class EppService {
  private apiUrl = 'sfdc/epp';

  constructor(private http: HttpClient) { }

  public get(): Observable<EPP[]> {
    return this.http.get<ICommonAPIResponse>(`${this.apiUrl}`)
      .pipe(
        map(data => (
          (data.records || []).map(
            epp => EPP.new(EPP, epp)
          )
        ))
      );
  }

}
