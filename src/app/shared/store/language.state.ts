import {Injectable} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Language, languages } from '../models/language';
import { LanguageCookieService } from '../services/language-cookie.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageState {
  readonly DEFAULT_LANG: Language = 'de';

  constructor(
    private languageCookieService: LanguageCookieService,
    private translateService: TranslateService
  ) {}

  initialize() {
    this.translateService.addLangs(languages);
    this.translateService.setDefaultLang(this.DEFAULT_LANG);
    const locale = this.getUserLocale();
    this.setLang(locale);
  }

  setLang(lang: Language) {
    this.languageCookieService.setLanguage(lang);
    moment.locale(lang);
    this.translateService.use(lang);
  }

  getLang(): Language {
    return this.languageCookieService.getLanguage() || this.DEFAULT_LANG;
  }
  
  private getUserLocale(): Language {
    const cookieLang = this.languageCookieService.getLanguage();
    if (cookieLang) {
      return cookieLang;
    }

    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return this.DEFAULT_LANG;
    }

    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : this.DEFAULT_LANG;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    for (const availableLanguage of languages) {
      if (lang.includes(availableLanguage)) {
        return availableLanguage;
      }
    }
    return this.DEFAULT_LANG;
  }
}
