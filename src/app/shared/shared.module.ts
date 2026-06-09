import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonDirective } from './directives/loading-button.directive';
import { GroupTypeColorDirective } from './directives/group-type-color.directive';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { ContentComponent } from './components/content/content.component';
import { FilterChipComponent } from './components/filters/type-filters/filter-chip/filter-chip.component';
import { ChipSelectionDirective } from './components/filters/type-filters/chip-selection.directive';
import { DatePickerComponent } from './components/filters/date-picker/date-picker.component';
import { TypeFiltersComponent } from './components/filters/type-filters/type-filters.component';
import { RouterModule } from '@angular/router';
import { DatePickerInputComponent } from './components/filters/date-picker-input/date-picker-input.component';
import { PopupComponent } from './components/popup/popup.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HeaderComponent } from './components/header/header.component';
import { SwitchComponent } from './components/switch/switch.component';
import { InfoComponent } from './components/info/info.component';
import { PermissionViewComponent } from './components/permission-view/permission-view.component';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbNavigationComponent } from './components/breadcrumb-navigation/breadcrumb-navigation.component';
import { WidgetFilterComponent } from './components/filters/widget-filter/widget-filter.component';
import { CensusFilterComponent } from './components/filters/census-filter/census-filter.component';
import { LanguageState } from './store/language.state';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    TranslatePipe,
    TranslateDirective,
    RouterModule,
    MatTableModule,
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
    exports: [
    WidgetFilterComponent,
    CommonModule,
    LoadingButtonDirective,
    GroupTypeColorDirective,
    TranslatePipe,
    TranslateDirective,
    FormsModule,
    ReactiveFormsModule,
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
        provideAppInitializer(() => {
            const initializerFn = ((langState: LanguageState) => () => langState.initialize())(inject(LanguageState));
            return initializerFn();
        })
    ]
})
export class SharedModule {
}
