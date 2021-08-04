import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthGuard} from './widget/guards/auth.guard';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartModule} from './chart/chart.module';
import {WidgetModule} from './widget/widget.module';
import { SharedModule} from './shared/shared.module';
import {CookieInterceptor} from './shared/interceptors/cookie.interceptor';
import {ServerErrorInterceptor} from './shared/interceptors/server-error.interceptor';
import {LocaleInterceptor} from './shared/interceptors/locale.interceptor';
import {TabsModule} from "./tabs/tabs.module";

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
    TabsModule,
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
