import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubdepartmentAnswerState} from '../../state/subdepartment-answer.state';
import {HierachicalSubDepartmentAnswer} from '../../models/subdepartment-answer';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss']
})
export class SummaryGridComponent implements OnInit, OnDestroy {

  data: HierachicalSubDepartmentAnswer[];

  private destroyed$ = new Subject();

  constructor(
    private subdepartmentAnswerState: SubdepartmentAnswerState,
  ) { }

  get loading(): boolean {
    return this.data == null;
  }

  ngOnInit(): void {
    this.subdepartmentAnswerState.getAnswers$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(data => {
      this.data = data.map(nested => ({
        parent: nested.parent,
        children: nested.children.map(sortAlphabetically)
      }));
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

function sortAlphabetically(nested: HierachicalSubDepartmentAnswer): HierachicalSubDepartmentAnswer {
  let children = []

  if (nested.children.length > 0) {
    children = nested.children.
    map(child => sortAlphabetically(child)).
    sort(
      (a,b) => (a.parent?.groupName ?? '').localeCompare(b.parent?.groupName ?? '')
    )
  }

  return {
    parent: nested.parent,
    children: children,
  }
}