import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {GamificationRoutingModule} from './gamification-routing.module';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { LevelCardComponent } from './level-card/level-card.component';
import { GoalStatusComponent } from './goal-status/goal-status.component';
import { PersonHeaderComponent } from './person-header/person-header.component';
import { GamificationPopupComponent } from './gamification-popup/gamification-popup.component';
import { LevelProgressComponent } from './level-progress/level-progress.component';
import { BetaAccessComponent } from './beta-access/beta-access.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@NgModule({
    declarations: [
        PersonalProfileComponent,
        LevelCardComponent,
        GoalStatusComponent,
        PersonHeaderComponent,
        GamificationPopupComponent,
        LevelProgressComponent,
        BetaAccessComponent
    ],
    exports: [
        GamificationPopupComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        GamificationRoutingModule,
        MatProgressSpinnerModule
    ]
})
export class GamificationModule { }
