import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SharedAnswerState } from '../../state/shared-answer.state';
import { HierachicalSharedAnswer } from '../../models/shared-answer';
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
  private sharedAnswerState = inject(SharedAnswerState);


  data: HierachicalSharedAnswer[];

  private destroyed$ = new Subject();

  get loading(): boolean {
    return this.data == null;
  }

  ngOnInit(): void {
    this.sharedAnswerState.getAnswers$().pipe(
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

function sortByGroupTypeThenGroupName(a: HierachicalSharedAnswer, b: HierachicalSharedAnswer): number {
  return (a.value.groupTypeId) - (b.value.groupTypeId) || (a.value.groupName ?? '').localeCompare(b.value.groupName ?? '')
}

function sortChildren(nested: HierachicalSharedAnswer): HierachicalSharedAnswer {
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