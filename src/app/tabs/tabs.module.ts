import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabWrapperComponent } from './components/tab-wrapper/tab-wrapper.component';
import { QuapTabComponent } from './components/tabs/quap/quap-tab/quap-tab.component';
import {TabsRoutingModule} from "./tabs-routing.module";
import {SharedModule} from "../shared/shared.module";
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';
import { TabDirective } from './directives/tab.directive';
import { TabComponent } from './components/tab/tab.component';

@NgModule({
  declarations: [
    TabWrapperComponent,
    QuapTabComponent,
    TabMenuComponent,
    TabDirective,
    TabComponent,
  ],
  imports: [
      CommonModule,
      TabsRoutingModule,
      SharedModule,
  ],
  exports: [
    TabWrapperComponent,
  ],
  providers: [
    {
      provide: 'tabs',
      useValue: [
        QuapTabComponent,
      ],
    }
  ],
})
export class TabsModule { }
