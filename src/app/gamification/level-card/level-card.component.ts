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

}
