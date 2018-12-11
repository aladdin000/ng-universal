import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiCoreInterceptor implements HttpInterceptor {
  private apiUrl = 'https://www.garp.org';
  // private apiUrl = '/api/v1';

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      url: this.setUrl(request.url),
    });

    return next.handle(request);
  }

  private setUrl(url: string): string {
    return url.indexOf('/') === 0
      ? `${this.apiUrl}${url}`
      : `${this.apiUrl}/${url}`
    ;
  }
}
