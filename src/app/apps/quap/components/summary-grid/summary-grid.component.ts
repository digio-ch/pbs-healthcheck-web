import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubdepartmentAnswerState} from '../../state/subdepartment-answer.state';
import {SubdepartmentAnswer} from '../../models/subdepartment-answer';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss']
})
export class SummaryGridComponent implements OnInit, OnDestroy {

  data: SubdepartmentAnswer[];

  private destroyed$ = new Subject();

  constructor(
    private subdepartmentAnswerState: SubdepartmentAnswerState,
  ) { }

  ngOnInit(): void {
    this.subdepartmentAnswerState.getAnswers$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(data => this.data = data);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
