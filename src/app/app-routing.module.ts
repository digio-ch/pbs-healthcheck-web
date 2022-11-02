import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './widget/guards/auth.guard';
import {LoginComponent} from './shared/components/login/login.component';
import {WrapperComponent} from './shared/components/wrapper/wrapper.component';
import {WidgetWrapperComponent} from './widget/components/widget-wrapper/widget-wrapper.component';

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
            path: 'widget',
            loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule)
          },
          {
            path: 'dashboard',
            component: WidgetWrapperComponent
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
