import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabComponent} from '../../../tab/tab.component';
import {TabService} from '../../../../services/tab.service';
import {Subject} from 'rxjs';
import {CalculationHelper} from '../../quap/services/calculation.helper';
import {SubdepartmentAnswerState} from '../state/subdepartment-answer.state';

@Component({
  selector: 'app-quap-overview-tab',
  templateUrl: './quap-overview-tab.component.html',
  styleUrls: ['./quap-overview-tab.component.scss']
})
export class QuapOverviewTabComponent extends TabComponent implements OnInit, OnDestroy {
  public static TAB_CLASS_NAME = 'QuapOverviewTabComponent';

  private destroyed$ = new Subject();

  constructor(
    tabService: TabService,
    private subdepartmentAnswerState: SubdepartmentAnswerState,
  ) {
    super(tabService, QuapOverviewTabComponent);
  }

  ngOnInit(): void {
    const data = this.data;

    data.forEach((entity, index) => {
      data[index].summary = CalculationHelper.calculateSummary(
        CalculationHelper.combineAnswerStacks(entity.answers, entity.computedAnswers),
        true,
      );
    });

    this.subdepartmentAnswerState.setAnswers(data);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
