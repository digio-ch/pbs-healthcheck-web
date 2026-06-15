import { enableProdMode, importProvidersFrom } from '@angular/core';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { WidgetModule } from './app/apps/widget/widget.module';
import { DashboardModule } from './app/dashboard/dashboard.module';
import { GamificationModule } from './app/gamification/gamification.module';
import { AuthGuard } from './app/guards/auth.guard';
import { CookieInterceptor } from './app/shared/interceptors/cookie.interceptor';
import { LocaleInterceptor } from './app/shared/interceptors/locale.interceptor';
import { ServerErrorInterceptor } from './app/shared/interceptors/server-error.interceptor';
import { SharedModule } from './app/shared/shared.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, NgxChartsModule, WidgetModule, SharedModule, DashboardModule, GamificationModule),
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CookieInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ServerErrorInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LocaleInterceptor,
            multi: true
        },
        provideTranslateService({
            fallbackLang: 'de',
            loader: provideTranslateHttpLoader(),
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideCharts(withDefaultRegisterables())
    ]
})
  .catch(err => console.error(err));
