import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Offer } from '../models/offer';
import { ICommonAPIResponse } from '../../shared/models/common-api-response';

@Injectable()
export class MembershipService {
  private apiUrl = 'sfdc/membership';

  constructor(private http: HttpClient) {}

  public getOffers(): Observable<Array<Offer>> {
    return this.http.get<ICommonAPIResponse>(`${this.apiUrl}/offers`)
      .pipe(
        map(data => (
          (data.records || []).map(
            offer => Offer.new(Offer, offer)
          )
        ))
      );
  }
}
