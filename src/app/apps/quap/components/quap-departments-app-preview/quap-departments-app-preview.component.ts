import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { CalculationHelper, Summary } from '../../services/calculation.helper';
import { QuapService } from '../../services/quap.service';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-quap-departments-app-preview',
    templateUrl: './quap-departments-app-preview.component.html',
    styleUrls: ['./quap-departments-app-preview.component.scss'],
    imports: [NgIf, LoadingComponent, SummaryViewComponent, TranslatePipe]
})
export class QuapDepartmentsAppPreviewComponent implements AfterViewInit, OnDestroy {

  values: Summary = [0,0,0,0,0,0];
  departmentCount: number;
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

      this.quapService.getDepartmentPreview(group.id).pipe(
        takeUntil(this.destroyed$),
        first(),
      ).subscribe(data => {
        this.departmentCount = data.length;

        const summaries: Summary[] = [];

        data.forEach(d => {
          summaries.push(CalculationHelper.calculateSummary(CalculationHelper.combineAnswerStacks(d.answers, d.computedAnswers), false));
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
          result[index] = Math.round(100 / total * value);
        });

        this.values = result;
        this.loading = false;
      });
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
