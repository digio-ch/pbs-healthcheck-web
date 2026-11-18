import { Component, computed, inject, signal } from '@angular/core';
import { filter, switchMap, tap } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { Group } from '../../../../shared/models/group';
import { CalculationHelper, Summary } from '../../services/calculation.helper';
import { QuapService } from '../../services/quap.service';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';
import { TranslateService } from '@ngx-translate/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-quap-shared-app-preview',
    templateUrl: './quap-shared-app-preview.component.html',
    styleUrls: ['./quap-shared-app-preview.component.scss'],
    imports: [LoadingComponent, SummaryViewComponent]
})
export class QuapSharedAppPreviewComponent {
  private groupFacade = inject(GroupFacade);
  private quapService = inject(QuapService);
  private translateService = inject(TranslateService);

  readonly isLoading = signal(true);

  readonly group = toSignal(
    this.groupFacade.getCurrentGroup$(),
    {
      initialValue: null
    }
  );

  readonly data = toSignal(
    toObservable(this.group).pipe(
      tap(() => this.isLoading.set(true)),
      filter((group): group is Group => !!group),
      switchMap(group => this.quapService.getSharedPreview(group.id)),
      tap(() => this.isLoading.set(false)),
    ),
    {
      initialValue: [],
    }
  );

  readonly label = this.translateService.translate(() => {
    const group = this.group();
    const len = this.data().length;

    if (!group) {
      return '';
    }

    const baseKey = group.isFederation() ? 'cantons-regions' : 'departments';

    return baseKey + (len === 1 ? '.count-one' : '.count-many');
    },
    () => ({ count: this.data().length })
  );

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
