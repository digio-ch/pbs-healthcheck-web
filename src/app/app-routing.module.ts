import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {LoginComponent} from './shared/components/login/login.component';
import {WrapperComponent} from './shared/components/wrapper/wrapper.component';
import {WidgetWrapperComponent} from './apps/widget/components/widget-wrapper/widget-wrapper.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { action: 'login' }
      },
      {
        path: 'callback',
        component: LoginComponent,
        data: { action: 'callback' }
      },
      {
        path: '',
        component: WrapperComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'app',
            loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
          },
          {
            path: 'dashboard',
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
