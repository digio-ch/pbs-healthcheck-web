import { Component, Input, OnInit } from '@angular/core';
import { GamificationLevel } from '../../shared/models/gamification/person';
import { NgClass } from '@angular/common';
import { LevelProgressComponent } from '../level-progress/level-progress.component';
import { InfoComponent } from '../../shared/components/info/info.component';
import { GoalStatusComponent } from '../goal-status/goal-status.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-level-card',
    templateUrl: './level-card.component.html',
    styleUrls: ['./level-card.component.scss'],
    imports: [NgClass, LevelProgressComponent, InfoComponent, GoalStatusComponent, TranslatePipe]
})
export class LevelCardComponent implements OnInit {

  isOpen = false;

  @Input() level: GamificationLevel;
  @Input() isComplete: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  toggleOpen() {
    this.level.active = !this.level.active;
  }

  getAmountCompleted(): number {
    return this.level.goals.reduce((acc: number, currentValue) => {
      return currentValue.completed ? acc + 1 : acc;
    }, 0);
  }

  getAmountProgressing(): number {
    return this.level.goals.reduce((acc: number, currentValue) => {
      return !currentValue.completed && currentValue.progress ? acc + 1 : acc;
    }, 0);
  }
}
