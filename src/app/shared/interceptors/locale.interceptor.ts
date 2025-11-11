import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { LanguageCookieService } from '../services/language-cookie.service';

@Injectable()
export class LocaleInterceptor implements HttpInterceptor {
  private defaultLocale = 'de';

  constructor(private languageService: LanguageCookieService){
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cookieLocale = this.languageService.getLanguage();
    const locale = cookieLocale ?? this.defaultLocale;

    return next.handle(request.clone({
      headers: request.headers.set('X-Locale', locale)
    }));
  }
}
