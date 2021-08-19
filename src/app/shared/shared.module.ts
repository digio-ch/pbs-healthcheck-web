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
import {LoginComponent} from "./components/login/login.component";
import {FooterComponent} from "./components/footer/footer.component";
import {WrapperComponent} from "./components/wrapper/wrapper.component";
import {ContentComponent} from "./components/content/content.component";
import {FilterChipComponent} from "./components/filters/type-filters/filter-chip/filter-chip.component";
import {ChipSelectionDirective} from "./components/filters/type-filters/chip-selection.directive";
import {DatePickerComponent} from "./components/filters/date-picker/date-picker.component";
import {TypeFiltersComponent} from "./components/filters/type-filters/type-filters.component";
import {RouterModule} from "@angular/router";
import { DatePickerInputComponent } from './components/filters/date-picker-input/date-picker-input.component';
import { PopupComponent } from './components/popup/popup.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { LoadingComponent } from './components/loading/loading.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LoadingButtonDirective,
    GroupTypeColorDirective,
    LoginComponent,
    FooterComponent,
    WrapperComponent,
    ContentComponent,
    FilterChipComponent,
    ChipSelectionDirective,
    DatePickerComponent,
    TypeFiltersComponent,
    DatePickerInputComponent,
    PopupComponent,
    DialogComponent,
    LoadingComponent,
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
    RouterModule,
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
        FilterChipComponent,
        TypeFiltersComponent,
        ContentComponent,
        DatePickerInputComponent,
        LoadingComponent,
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
