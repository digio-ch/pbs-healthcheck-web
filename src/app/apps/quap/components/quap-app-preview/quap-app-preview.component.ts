import { Component, inject, signal } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { CalculationHelper } from '../../services/calculation.helper';
import { QuapService } from '../../services/quap.service';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-quap-app-preview',
    templateUrl: './quap-app-preview.component.html',
    styleUrls: ['./quap-app-preview.component.scss'],
    imports: [LoadingComponent, SummaryViewComponent]
})
export class QuapAppPreviewComponent {
  private groupFacade = inject(GroupFacade);
  private quapService = inject(QuapService);

  readonly isLoading = signal(true);

  readonly values = toSignal(
    this.groupFacade.getCurrentGroup$().pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(group => this.quapService.getPreview(group.id)),
      map((data) => {
        const processed = CalculationHelper.combineAnswerStacks(data.answers, data.computedAnswers);

        return CalculationHelper.calculateSummary(processed, true);
      }),
      tap(() => this.isLoading.set(false)),
    ),
    {
      initialValue: [0,0,0,0,0,0],
    }
  );
}
