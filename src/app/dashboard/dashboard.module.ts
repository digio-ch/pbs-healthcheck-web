import {NgModule} from '@angular/core';
import {AppListComponent} from './components/app-list/app-list.component';
import { DashboardWrapperComponent } from './components/dashboard-wrapper/dashboard-wrapper.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {AppsFacade} from './store/facade/apps.facade';
import {QuapModule} from '../apps/quap/quap.module';
import {WidgetModule} from '../apps/widget/widget.module';
import {ChartModule} from '../chart/chart.module';

@NgModule({
  declarations: [
    AppListComponent,
    DashboardWrapperComponent,
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    SharedModule,
    QuapModule,
    WidgetModule,
    ChartModule,
  ],
  providers: [
    AppsFacade,
  ],
  exports: [],
})
export class DashboardModule { }
