import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, merge, of, Subject } from 'rxjs';
import { SubdepartmentAnswerState } from '../../state/subdepartment-answer.state';
import { first, takeUntil } from 'rxjs/operators';
import { QuapService } from '../../services/quap.service';
import { CalculationHelper } from '../../services/calculation.helper';
import { GroupFacade } from '../../../../store/facade/group.facade';
import { DateFacade } from '../../../../store/facade/date.facade';
import { DateSelection } from '../../../../shared/models/date-selection/date-selection';
import { TranslateService } from '@ngx-translate/core';
import { HierachicalSubDepartmentAnswer } from '../../models/subdepartment-answer';

import { DatePickerInputComponent } from '../../../../shared/components/filters/date-picker-input/date-picker-input.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-quap-departments-app',
    templateUrl: './quap-departments-app.component.html',
    styleUrls: ['./quap-departments-app.component.scss'],
    imports: [DatePickerInputComponent, LoadingComponent, RouterOutlet]
})
export class QuapDepartmentsAppComponent implements OnInit, OnDestroy {

  filterLoading = true;
  dataLoading = true;

  private destroyed$ = new Subject();

  constructor(
    private groupFacade: GroupFacade,
    private dateFacade: DateFacade,
    private quapService: QuapService,
    private subdepartmentAnswerState: SubdepartmentAnswerState,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    const langSwitch$ = merge(
      of(null), // trigger if the page is loaded after the initial onLangChange
      this.translateService.onLangChange
    );

    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.dateFacade.getDateSelection$(),
      langSwitch$,
    ]).pipe(
      takeUntil(this.destroyed$),
    ).subscribe(([group, dateSelection]) => {
      this.dataLoading = true;
      if (dateSelection == null) {
        return;
      }
      if (dateSelection.isRange) {
        this.dateFacade.setDateSelection(new DateSelection(dateSelection.startDate, null, false));
        return;
      }
      this.filterLoading = false;

      this.quapService.getSubdepartmentAnswers(dateSelection, group.id).pipe(
        first(),
      ).subscribe(data => {
        this.subdepartmentAnswerState.setAnswers(
          data.map(entry => this.addSummary(entry))
        );

        this.dataLoading = false;
      });
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  addSummary(hierarchicalAnswer: HierachicalSubDepartmentAnswer) {
    const subdepartmentAnswer = hierarchicalAnswer.value;

    if (subdepartmentAnswer !== null) {
      hierarchicalAnswer.value.summary = CalculationHelper.calculateSummary(
        CalculationHelper.combineAnswerStacks(subdepartmentAnswer.answers, subdepartmentAnswer.computedAnswers),
        true,
      )
    }

    if (hierarchicalAnswer.children.length > 0) {
      hierarchicalAnswer.children = hierarchicalAnswer.children.map(h => this.addSummary(h))
    }

    return hierarchicalAnswer;
  }
}
