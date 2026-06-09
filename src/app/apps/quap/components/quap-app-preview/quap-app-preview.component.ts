import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { CalculationHelper, Summary } from '../../services/calculation.helper';
import { QuapService } from '../../services/quap.service';

import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';

@Component({
    selector: 'app-quap-app-preview',
    templateUrl: './quap-app-preview.component.html',
    styleUrls: ['./quap-app-preview.component.scss'],
    imports: [LoadingComponent, SummaryViewComponent]
})
export class QuapAppPreviewComponent implements AfterViewInit, OnDestroy {

  values: Summary = [0,0,0,0,0,0];
  loading = true;

  private destroyed$ = new Subject();

  constructor(
    private groupFacade: GroupFacade,
    private quapService: QuapService,
  ) { }

  ngAfterViewInit(): void {
    this.groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => {
      this.loading = true;

      this.quapService.getPreview(group.id).pipe(
        first(),
      ).subscribe(data => {
        const processed = CalculationHelper.combineAnswerStacks(data.answers, data.computedAnswers);

        this.values = CalculationHelper.calculateSummary(processed, true);

        this.loading = false;
      });
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
