import {Component, Input, OnInit} from '@angular/core';
import {GamificationLevel} from '../../shared/models/gamification';

@Component({
  selector: 'app-level-card',
  templateUrl: './level-card.component.html',
  styleUrls: ['./level-card.component.scss']
})
export class LevelCardComponent implements OnInit {

  isOpen = false;

  @Input() level: GamificationLevel;

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
