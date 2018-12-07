import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from '../models/contact';


export interface ICertifiedCandidatesByTypeResponse {
    records: Contact[];
}

@Injectable({
    providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'sfdc/candidates';

  constructor(private http: HttpClient) {}

  public getCertifiedCandidatesByType(type: string, startDate: string, endDate: string): Observable<Contact[]> {
    return this.http.get<ICertifiedCandidatesByTypeResponse>(`${this.apiUrl}/certified/${type}/${startDate}/${endDate}`)
    .pipe(
      map(data => (
        (data.records || []).map(
          contact => Contact.new(Contact, contact)
        )
      ))
    );
  }
}
