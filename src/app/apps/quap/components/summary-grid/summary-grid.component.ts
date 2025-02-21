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
      this.data = data.map(sortChildren).sort(sortByGroupTypeThenGroupName);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

function sortByGroupTypeThenGroupName(a: HierachicalSubDepartmentAnswer, b: HierachicalSubDepartmentAnswer): number {
  return (a.value.groupTypeId) - (b.value.groupTypeId) || (a.value.groupName ?? '').localeCompare(b.value.groupName ?? '')
}

function sortChildren(nested: HierachicalSubDepartmentAnswer): HierachicalSubDepartmentAnswer {
  let children = []

  if (nested.children.length > 0) {
    children = nested.children.
    map(child => sortChildren(child)).
    sort(sortByGroupTypeThenGroupName)
  }

  return {
    value: nested.value,
    children: children,
  }
}