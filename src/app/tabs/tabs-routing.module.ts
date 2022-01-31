import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabWrapperComponent} from './components/tab-wrapper/tab-wrapper.component';
import {SummaryGridComponent} from './components/tabs/quap-overview/components/summary-grid/summary-grid.component';
import {
  GraphDetailsComponent
} from './components/tabs/quap-overview/components/graph-details/graph-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'quap',
        component: TabWrapperComponent,
        data: {
          tag: 'quap',
        }
      },
      {
        path: 'quap-groups',
        component: TabWrapperComponent,
        data: {
          tag: 'quap-overview',
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
      },
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

