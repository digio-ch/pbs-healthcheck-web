import { Component, computed, inject, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { CalculationHelper, Summary } from '../../services/calculation.helper';
import { QuapService } from '../../services/quap.service';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-quap-departments-app-preview',
    templateUrl: './quap-departments-app-preview.component.html',
    styleUrls: ['./quap-departments-app-preview.component.scss'],
    imports: [LoadingComponent, SummaryViewComponent, TranslatePipe]
})
export class QuapDepartmentsAppPreviewComponent {
  private groupFacade = inject(GroupFacade);
  private quapService = inject(QuapService);

  readonly isLoading = signal(true);

  readonly data = toSignal(
    this.groupFacade.getCurrentGroup$().pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(group => this.quapService.getDepartmentPreview(group.id)),
      tap(() => this.isLoading.set(false)),
    ),
    {
      initialValue: [],
    }
  );

  readonly departmentCount = computed(() => {
    return this.data().length;
  })

  readonly values = computed(() => {
    const summaries: Summary[] = [];

    this.data().forEach(d => {
      summaries.push(
        CalculationHelper.calculateSummary(CalculationHelper.combineAnswerStacks(d.answers, d.computedAnswers), false)
      );
    });

    let total = 0;
    const result: Summary = [0, 0, 0, 0, 0, 0];

    summaries.forEach(summary => {
      summary.forEach((value, index) => {
        result[index] += value;
        total += value;
      });
    });

    result.forEach((value, index) => {
      if (total === 0) {
        return;
      }
      result[index] = Math.round(100 / total * value);
    });

    return result;
  })
}
