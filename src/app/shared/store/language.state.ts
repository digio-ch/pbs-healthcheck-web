import {Injectable} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Language, languages } from '../models/language';
import { LanguageCookieService } from '../services/language-cookie.service';


/**
 * TODO: document current situation with LanguageState and TranslateService
 */

@Injectable({
  providedIn: 'root'
})
export class LanguageState {
  constructor(
    private languageCookieService: LanguageCookieService,
    private translateService: TranslateService
  ) {}

  initialize() {
    this.translateService.addLangs(languages);
    this.translateService.setDefaultLang('de');
    const locale = this.getUserLocale();
    this.setLang(locale);
  }

  setLang(lang: Language) {
    this.languageCookieService.setLanguage(lang);
    moment.locale(lang);
    this.translateService.use(lang);
  }

  getLang(): string {
    return this.translateService.currentLang;
  }
  
  private getUserLocale(): Language {
    const cookieLang = this.languageCookieService.getLanguage();
    if (cookieLang) {
      return cookieLang;
    }

    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return 'de';
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : 'de';
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    for (const availableLanguage of languages) {
      if (lang.includes(availableLanguage)) {
        return availableLanguage;
      }
    }
    return 'de';
  }
}
