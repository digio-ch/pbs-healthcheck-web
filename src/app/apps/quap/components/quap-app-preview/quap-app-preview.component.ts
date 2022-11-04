import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuapService} from '../../services/quap.service';
import {combineLatest, Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {DateFacade} from '../../../../store/facade/date.facade';
import {CalculationHelper} from '../../services/calculation.helper';
import {DateSelection} from '../../../../shared/models/date-selection/date-selection';
import {FilterFacade} from '../../../../store/facade/filter.facade';

@Component({
  selector: 'app-quap-app-preview',
  templateUrl: './quap-app-preview.component.html',
  styleUrls: ['./quap-app-preview.component.scss']
})
export class QuapAppPreviewComponent implements OnInit, OnDestroy {

  values: number[];
  loading = true;

  private destroyed$ = new Subject();

  constructor(
    private groupFacade: GroupFacade,
    private dateFacade: DateFacade,
    private filterFacade: FilterFacade,
    private quapService: QuapService,
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.dateFacade.getDateSelection$(),
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([group, dateSelection]) => {
      if (!dateSelection) {
        return;
      }

      this.quapService.getAnswers(dateSelection, group.id).pipe(
        first(),
      ).subscribe(data => {
        const processed = CalculationHelper.combineAnswerStacks(data.answers, data.computedAnswers);

        this.values = CalculationHelper.calculateSummary(processed, true);

        this.loading = false;
      });
    });

    this.dateFacade.getAvailableDates$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(availableDates => {
      if (!availableDates) {
        return;
      }

      this.dateFacade.setDateSelection(new DateSelection(availableDates[0].date, availableDates[0].date, false));
    });

    this.groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => this.filterFacade.loadFilterData(group));
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
