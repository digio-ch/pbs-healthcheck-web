import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuapAppComponent } from './quap/components/quap-app/quap-app.component';
import { GraphDetailsComponent } from './quap/components/graph-details/graph-details.component';
import { QuapDepartmentsAppComponent } from './quap/components/quap-departments-app/quap-departments-app.component';
import { SummaryGridComponent } from './quap/components/summary-grid/summary-grid.component';
import { OverviewDepartmentsAppComponent } from './widget/components/overview-departments-app/overview-departments-app.component';
import { OverviewAppComponent } from './widget/components/overview-app/overview-app.component';
import { CensusAppComponent } from './widget/components/census-app/census-app.component';
import { OverviewDepartmentAppComponent } from './widget/components/overview-department-app/overview-department-app.component';
import { MY_ORGANIZATION_ROUTES } from './my-organization/my-organization.routes';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'health',
        component: OverviewAppComponent,
      },
      {
        path: 'census',
        component: CensusAppComponent,
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
        path: 'health-departments',
        component: OverviewDepartmentsAppComponent,
      },
      {
        path: 'health-departments/:id',
        component: OverviewDepartmentAppComponent,
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'my-organization',
        children: MY_ORGANIZATION_ROUTES,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
