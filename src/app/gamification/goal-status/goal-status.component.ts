import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-goal-status',
  templateUrl: './goal-status.component.html',
  styleUrls: ['./goal-status.component.scss']
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
