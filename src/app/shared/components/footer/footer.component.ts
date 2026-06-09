import { Component, Input, OnInit, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LanguageState } from '../../store/language.state';
import { Language } from '../../models/language';
import { NgClass } from '@angular/common';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

interface LanguageOption {
  code: Language;
  name: string;
}

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [NgClass, TranslateDirective, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, TranslatePipe]
})
export class FooterComponent implements OnInit {
  private languageState = inject(LanguageState);

  @Input() absolute = false;
  @Input() hasData = true;
  @Input() importDate = 'unknown';
  @Input() skipLastImport = false;


  selectedLang: LanguageOption;

  languageOptions: LanguageOption[] = [
    {
      code: 'de',
      name: 'Deutsch',
    },
    {
      code: 'fr',
      name: 'Français',
    },
    {
      code: 'it',
      name: 'Italiano',
    },
  ]

  constructor() {
    const languageState = this.languageState;
 
    this.selectedLang = this.languageOptions.find(opt => 
      opt.code == languageState.getLang()
    );
  }

  ngOnInit(): void {
  }

  get version(): string {
    return environment.version;
  }

  toggleLanguage(opt: LanguageOption) {
    this.selectedLang = opt;
    this.languageState.setLang(opt.code);
  }

  getCurrentLanguage(): string {
    return this.languageState.getLang();
  } 
}
