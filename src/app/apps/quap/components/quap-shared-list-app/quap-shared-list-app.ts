import { Component, computed, inject } from '@angular/core';
import { SharedAnswerState } from '../../state/shared-answer.state';
import { HierachicalSharedAnswer } from '../../models/shared-answer';

import { HierarchicalSummaryViewsComponent } from '../hierarchical-summary-views/hierarchical-summary-views.component';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DatePickerInputComponent } from "src/app/shared/components/filters/date-picker-input/date-picker-input.component";
import { LoadingComponent } from "src/app/shared/components/loading/loading.component";
import { DateFacade } from 'src/app/store/facade/date.facade';
import moment from 'moment';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { ExportButtonComponent } from "../export-button/export-button.component";
import { QuapExportFacade } from '../../facades/quap-export.facade';

@Component({
    selector: 'app-quap-shared-list-app',
    templateUrl: './quap-shared-list-app.html',
    styleUrls: ['./quap-shared-list-app.scss'],
    imports: [HierarchicalSummaryViewsComponent, TranslatePipe, DatePickerInputComponent, LoadingComponent, ExportButtonComponent]
})
export class QuapSharedListApp {
  private dateFacade = inject(DateFacade);
  private groupFacade = inject(GroupFacade);
  private exportFacade = inject(QuapExportFacade);
  readonly sharedAnswerState = inject(SharedAnswerState);

  readonly date = toSignal(
    this.dateFacade.getDateSelection$().pipe(
      map(selection => selection.startDate)
    ),
    {
      initialValue: moment(),
    }
  );

  readonly group = toSignal(
    this.groupFacade.getCurrentGroup$()
  );

  readonly isFilterLoading = toSignal(
    this.dateFacade.getDateSelection$().pipe(
      map(dateSelection => dateSelection.isRange),
    ),
    {
      initialValue: true,
    }
  );

  readonly data = toSignal(
    this.sharedAnswerState.getAnswers$().pipe(
      map(data => data.map(sortChildren).sort(sortByGroupTypeThenGroupName)),
      takeUntilDestroyed(),
    ),
    {
      initialValue: null,
    }
  );

  readonly isEmpty = computed(() => {
    const data = this.data();

    return !data || this.isEmptyTree(data);
  });

  private isEmptyTree(data: HierachicalSharedAnswer[]): boolean {
    return (
      data.length === 1 &&
      data[0].value === null &&
      data[0].children.length === 0
    );
  }

  async onExport() {    
    if (!this.group()) {
      return;
    }

    this.exportFacade.exportAllSharedQuaps(
      this.group().id,
      this.date()
    );
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