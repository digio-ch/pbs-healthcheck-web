import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {GamificationRoutingModule} from './gamification-routing.module';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { LevelCardComponent } from './level-card/level-card.component';
import { GoalStatusComponent } from './goal-status/goal-status.component';
import { PersonHeaderComponent } from './person-header/person-header.component';
import { GamificationPopupComponent } from './gamification-popup/gamification-popup.component';



@NgModule({
  declarations: [
    PersonalProfileComponent,
    LevelCardComponent,
    GoalStatusComponent,
    PersonHeaderComponent,
    GamificationPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GamificationRoutingModule
  ]
})
export class GamificationModule { }
