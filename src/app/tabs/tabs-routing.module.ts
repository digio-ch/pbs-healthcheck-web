import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SummaryGridComponent} from '../apps/quap/components/summary-grid/summary-grid.component';
import {
  GraphDetailsComponent
} from '../apps/quap/components/graph-details/graph-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      /*{
        path: 'quap',
        data: {
          tag: 'quap',
        }
      },
      {
        path: 'quap-groups',
        data: {
          tag: 'quap-groups',
        },
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
      },*/
      {
        path: '',
        redirectTo: 'quap',
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }

