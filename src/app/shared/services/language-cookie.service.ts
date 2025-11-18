import {Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Language, languages } from '../models/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageCookieService {
  readonly LANGUAGE_COOKIE_KEY = "lang";

  constructor(private cookieService: CookieService) {
  }

  getLanguage(): Language | null {
    if (!this.cookieService.check(this.LANGUAGE_COOKIE_KEY)) {
      return null;
    }

    const locale = this.cookieService.get(this.LANGUAGE_COOKIE_KEY) as Language;

    // ignore the value if it is not a recognized language
    if (!languages.some(lang => lang === locale)) {
      return null;
    }

    return locale;
  }

  setLanguage(lang: Language) {
    // set cookie with a TTL of 1 year
    this.cookieService.set(this.LANGUAGE_COOKIE_KEY, lang, 365, '/');
  }
}
