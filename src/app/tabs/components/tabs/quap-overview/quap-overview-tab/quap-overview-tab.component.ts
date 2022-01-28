import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabComponent} from '../../../tab/tab.component';
import {TabService} from '../../../../services/tab.service';
import {Subject} from 'rxjs';
import {CalculationHelper, Summary} from '../../quap/services/calculation.helper';

@Component({
  selector: 'app-quap-overview-tab',
  templateUrl: './quap-overview-tab.component.html',
  styleUrls: ['./quap-overview-tab.component.scss']
})
export class QuapOverviewTabComponent extends TabComponent implements OnInit, OnDestroy {
  public static TAB_CLASS_NAME = 'QuapOverviewTabComponent';

  private destroyed$ = new Subject();

  aggregatedData: {
    name: string,
    summary: Summary,
  }[] = [];

  constructor(
    tabService: TabService,
  ) {
    super(tabService, QuapOverviewTabComponent);
  }

  ngOnInit(): void {
    this.data.forEach(entity => {
      const summary = CalculationHelper.calculateSummary(
        CalculationHelper.combineAnswerStacks(entity.answers, entity.computedAnswers),
        true,
      );

      this.aggregatedData.push({
        name: entity.groupName,
        summary
      });
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
