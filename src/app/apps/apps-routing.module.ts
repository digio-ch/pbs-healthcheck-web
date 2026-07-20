import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuapAppComponent } from './quap/components/quap-app/quap-app.component';
import { QuapSharedAppComponent } from './quap/components/quap-shared-app/quap-shared-app.component';
import { QuapSharedAppShellComponent } from './quap/components/quap-shared-app-shell/quap-shared-app-shell.component';
import { QuapSharedListApp } from './quap/components/quap-shared-list-app/quap-shared-list-app';
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
        path: 'quaps',
        component: QuapSharedAppShellComponent,
        children: [
          {
            path: ':id',
            component: QuapSharedAppComponent,
          },
          {
            path: '',
            component: QuapSharedListApp,
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
