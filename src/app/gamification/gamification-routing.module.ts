import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PersonalProfileComponent} from './personal-profile/personal-profile.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'person',
        component: PersonalProfileComponent
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
export class GamificationRoutingModule { }
