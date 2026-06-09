import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SubdepartmentAnswerState } from '../../state/subdepartment-answer.state';
import { HierachicalSubDepartmentAnswer } from '../../models/subdepartment-answer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HierarchicalSummaryViewsComponent } from '../hierarchical-summary-views/hierarchical-summary-views.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-summary-grid',
    templateUrl: './summary-grid.component.html',
    styleUrls: ['./summary-grid.component.scss'],
    imports: [HierarchicalSummaryViewsComponent, TranslatePipe]
})
export class SummaryGridComponent implements OnInit, OnDestroy {
  private subdepartmentAnswerState = inject(SubdepartmentAnswerState);


  data: HierachicalSubDepartmentAnswer[];

  private destroyed$ = new Subject();

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