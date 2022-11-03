import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {QuapAppComponent} from './quap/components/quap-app/quap-app.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*{
        path: 'overview',
      },*/
      {
        path: 'quap',
        component: QuapAppComponent,
      },
      /*{
        path: 'quap-groups',
      },*/
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
