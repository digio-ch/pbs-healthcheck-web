import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {SubdepartmentAnswerState} from '../../state/subdepartment-answer.state';
import {first, takeUntil} from 'rxjs/operators';
import {QuapService} from '../../services/quap.service';
import {CalculationHelper} from '../../services/calculation.helper';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {DateFacade} from '../../../../store/facade/date.facade';
import {BreadcrumbService} from '../../../../shared/services/breadcrumb.service';
import {DateSelection} from '../../../../shared/models/date-selection/date-selection';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-quap-departments-app',
  templateUrl: './quap-departments-app.component.html',
  styleUrls: ['./quap-departments-app.component.scss']
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
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.dateFacade.getDateSelection$(),
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

  addSummary(hierarchicalAnswer) {
    const subdepartmentAnswer = hierarchicalAnswer.parent;

    if (subdepartmentAnswer !== null) {
      hierarchicalAnswer.parent.summary = CalculationHelper.calculateSummary(
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
