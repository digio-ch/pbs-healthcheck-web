import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {QuapAppComponent} from './quap/components/quap-app/quap-app.component';
import {GraphDetailsComponent} from './quap/components/graph-details/graph-details.component';
import {QuapDepartmentsAppComponent} from './quap/components/quap-departments-app/quap-departments-app.component';
import {SummaryGridComponent} from './quap/components/summary-grid/summary-grid.component';
import {WidgetWrapperComponent} from './widget/components/widget-wrapper/widget-wrapper.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'widgets',
        component: WidgetWrapperComponent,
      },
      {
        path: 'quap',
        component: QuapAppComponent,
      },
      {
        path: 'quap-departments',
        component: QuapDepartmentsAppComponent,
        children: [
          {
            path: ':id',
            component: GraphDetailsComponent,
          },
          {
            path: '',
            component: SummaryGridComponent,
          }
        ]
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
