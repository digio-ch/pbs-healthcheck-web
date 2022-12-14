import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {QuapService} from '../../services/quap.service';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {DateFacade} from '../../../../store/facade/date.facade';
import {CalculationHelper} from '../../services/calculation.helper';
import {FilterFacade} from '../../../../store/facade/filter.facade';

@Component({
  selector: 'app-quap-app-preview',
  templateUrl: './quap-app-preview.component.html',
  styleUrls: ['./quap-app-preview.component.scss']
})
export class QuapAppPreviewComponent implements AfterViewInit, OnDestroy {

  values: number[];
  loading = true;

  private destroyed$ = new Subject();

  constructor(
    private groupFacade: GroupFacade,
    private dateFacade: DateFacade,
    private filterFacade: FilterFacade,
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
