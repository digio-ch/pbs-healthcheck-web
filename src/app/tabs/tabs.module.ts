import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabWrapperComponent } from './components/tab-wrapper/tab-wrapper.component';
import { QuapTabComponent } from './components/tabs/quap/quap-tab/quap-tab.component';
import {TabsRoutingModule} from "./tabs-routing.module";

@NgModule({
  declarations: [TabWrapperComponent, QuapTabComponent],
  imports: [
    CommonModule,
    TabsRoutingModule,
  ]
})
export class TabsModule { }
