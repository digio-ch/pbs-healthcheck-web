import {Component, Input, OnInit} from '@angular/core';
import {GamificationLevel} from '../../shared/models/gamification';

@Component({
  selector: 'app-level-progress',
  templateUrl: './level-progress.component.html',
  styleUrls: ['./level-progress.component.scss']
})
export class LevelProgressComponent implements OnInit {

  private notCompletedColor = '#E5E7E9';
  private completedColor = '#7DC789';
  private progressingColor = '#cfa12b';

  @Input() segments: number;
  @Input() required: number;
  @Input() completed: number;
  @Input() progressing: number;
  @Input() levelComplete: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  isComplete(): boolean {
    return this.levelComplete;
  }

  getColorForIndex(index: number): string {
    if (index < this.completed) {
      return this.completedColor;
    }
    if (index < this.completed + this.progressing) {
      return this.progressingColor;
    }
    return this.notCompletedColor;
  }
}
