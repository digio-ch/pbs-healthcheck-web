import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class LocaleInterceptor implements HttpInterceptor {
  private defaultLocale = 'de';

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storageLocale = localStorage.getItem('locale');
    const locale = storageLocale ?? this.defaultLocale;
    return next.handle(request.clone({
      headers: request.headers.set('X-Locale', locale)
    }));
  }
}
