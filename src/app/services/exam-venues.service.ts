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
export class ExamVenuesService {
  private apiUrl = 'sfdc/examVenues';

  constructor(private http: HttpClient) { }

  public get(date): Observable<ICommonAPIResponse> {
    return this.http.get<ICommonAPIResponse>(`${this.apiUrl}/${date}`);
  }

  public getVenuesByRegion(data) {
    const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
    const venues = {};
    for (let i = 0; i < regions.length; i++) {
        venues[regions[i]] = this.filterVenues(data.records, regions[i]);
    }
    return venues;
    }

    private filterVenues(venues, region) {
        return _.filter(venues, { 'Region__c': region, 'Site__r': { 'Active__c': true } });
    }

}
