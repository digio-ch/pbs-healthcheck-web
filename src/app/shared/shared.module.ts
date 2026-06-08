import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingButtonDirective} from './directives/loading-button.directive';
import {GroupTypeColorDirective} from './directives/group-type-color.directive';
import {HttpClient} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {StoreModule} from '../store/store.module';
import {LoginComponent} from './components/login/login.component';
import {FooterComponent} from './components/footer/footer.component';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {ContentComponent} from './components/content/content.component';
import {FilterChipComponent} from './components/filters/type-filters/filter-chip/filter-chip.component';
import {ChipSelectionDirective} from './components/filters/type-filters/chip-selection.directive';
import {DatePickerComponent} from './components/filters/date-picker/date-picker.component';
import {TypeFiltersComponent} from './components/filters/type-filters/type-filters.component';
import {RouterModule} from '@angular/router';
import {DatePickerInputComponent} from './components/filters/date-picker-input/date-picker-input.component';
import {PopupComponent} from './components/popup/popup.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {LoadingComponent} from './components/loading/loading.component';
import {HeaderComponent} from './components/header/header.component';
import {SwitchComponent} from './components/switch/switch.component';
import {InfoComponent} from './components/info/info.component';
import {PermissionViewComponent} from './components/permission-view/permission-view.component';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import { BreadcrumbNavigationComponent } from './components/breadcrumb-navigation/breadcrumb-navigation.component';
import { WidgetFilterComponent } from './components/filters/widget-filter/widget-filter.component';
import { CensusFilterComponent } from './components/filters/census-filter/census-filter.component';
import { LanguageState } from './store/language.state';
import { CookieService } from 'ngx-cookie-service';

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
    HeaderComponent,
    SwitchComponent,
    InfoComponent,
    PermissionViewComponent,
    BreadcrumbNavigationComponent,
    WidgetFilterComponent,
    CensusFilterComponent,
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
    TranslateModule,
    RouterModule,
    MatTableModule,
  ],
  exports: [
    WidgetFilterComponent,
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
    SwitchComponent,
    InfoComponent,
  ],
  providers: [
    CookieService,
    {
      provide: 'filters',
      useValue: [
        TypeFiltersComponent,
        CensusFilterComponent
      ],
    },
    // instantiate the language state on startup
    {
      provide: APP_INITIALIZER,
      useFactory: (langState: LanguageState) => () => langState.initialize(),
      deps: [LanguageState],
      // don't overwrite other configs with the APP_INITIALIZER token
      multi: true,
    }
  ]
})
export class SharedModule {
}
