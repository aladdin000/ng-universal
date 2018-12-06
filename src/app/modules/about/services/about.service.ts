import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AboutService {
  private url = 'sfdc';

  constructor(private http: HttpClient) {}

  getFellows() {
    this.http.get(`${this.url}/fellowships`)
      .subscribe()
    ;
  }
}
