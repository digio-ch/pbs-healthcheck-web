import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import { LanguageState } from '../../store/language.state';
import { Language } from '../../models/language';

interface LanguageOption {
  code: Language;
  name: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
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

  constructor(private languageState: LanguageState) { 
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
