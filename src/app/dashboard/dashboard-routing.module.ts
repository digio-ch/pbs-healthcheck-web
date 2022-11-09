import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardWrapperComponent} from './components/dashboard-wrapper/dashboard-wrapper.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardWrapperComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
