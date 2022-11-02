import {NgModule} from '@angular/core';
import {AppListComponent} from './components/app-list/app-list.component';
import { DashboardWrapperComponent } from './components/dashboard-wrapper/dashboard-wrapper.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CommonModule} from '@angular/common';
import {AppStore} from './store/app.store';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    AppListComponent,
    DashboardWrapperComponent
  ],
    imports: [
        DashboardRoutingModule,
        CommonModule,
        SharedModule,
    ],
  providers: [
    AppStore,
  ],
  exports: [],
})
export class DashboardModule { }
