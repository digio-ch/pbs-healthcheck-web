import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthGuard} from './guards/auth.guard';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartModule} from './chart/chart.module';
import {WidgetModule} from './apps/widget/widget.module';
import { SharedModule} from './shared/shared.module';
import {CookieInterceptor} from './shared/interceptors/cookie.interceptor';
import {ServerErrorInterceptor} from './shared/interceptors/server-error.interceptor';
import {LocaleInterceptor} from './shared/interceptors/locale.interceptor';
import {DashboardModule} from './dashboard/dashboard.module';
import {NgChartsModule} from 'ng2-charts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ChartModule,
    WidgetModule,
    SharedModule,
    DashboardModule,
    NgChartsModule,
    // import the translation service as singleton
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
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
    }
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
