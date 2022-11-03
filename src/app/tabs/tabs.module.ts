import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabsRoutingModule} from './tabs-routing.module';
import {SharedModule} from '../shared/shared.module';
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';
import { TabDirective } from './directives/tab.directive';

@NgModule({
  declarations: [
    TabMenuComponent,
    TabDirective,
  ],
  imports: [
    CommonModule,
    TabsRoutingModule,
    SharedModule,
  ],
  providers: [
  ],
})
export class TabsModule { }
