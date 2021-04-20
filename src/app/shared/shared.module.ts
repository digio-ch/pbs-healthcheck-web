import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingButtonDirective} from './directives/loading-button.directive';
import { GroupTypeColorDirective } from './directives/group-type-color.directive';
import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader, TranslateService, TranslateStore} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import * as moment from 'moment';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {StoreModule} from '../store/store.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LoadingButtonDirective,
    GroupTypeColorDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule,
    // Angular Material Modules
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule.forChild({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    CommonModule,
    LoadingButtonDirective,
    GroupTypeColorDirective,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule,
    // Angular Material Modules
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [TranslateService, TranslateStore]
})
export class SharedModule {
  readonly languages = ['de', 'fr', 'it'];
  constructor(
    private translateService: TranslateService
  ) {
    translateService.addLangs(this.languages);
    translateService.setDefaultLang('de');
    const locale = this.getUserLocale();
    translateService.use(locale);
    moment.locale(locale);
    localStorage.setItem('locale', locale);
  }

  private getUserLocale() {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return 'de';
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : 'de';
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    for (const availableLanguage of this.languages) {
      if (lang.includes(availableLanguage)) {
        return availableLanguage;
      }
    }
    return 'de';
  }
}
