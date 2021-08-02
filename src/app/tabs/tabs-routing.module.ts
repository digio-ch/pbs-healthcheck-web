import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TabWrapperComponent} from "./components/tab-wrapper/tab-wrapper.component";

const routes: Routes = [
  {
    path: '',
    component: TabWrapperComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }

