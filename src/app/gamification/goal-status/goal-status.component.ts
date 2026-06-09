import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { InfoComponent } from '../../shared/components/info/info.component';

@Component({
    selector: 'app-goal-status',
    templateUrl: './goal-status.component.html',
    styleUrls: ['./goal-status.component.scss'],
    imports: [NgIf, InfoComponent]
})
export class GoalStatusComponent implements OnInit {

  @Input() completed: boolean;
  @Input() progress: number;
  @Input() message: string;
  constructor() { }

  ngOnInit(): void {
  }

  transformMessage() {
    return this.message.replace(/%/g, '' + this.progress);
  }
}
