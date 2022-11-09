import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {AnswerStack} from '../../../../quap/models/question';
import {CalculationHelper, Summary} from '../../../../quap/services/calculation.helper';

@Component({
  selector: 'app-quap-overview',
  templateUrl: './quap-overview.component.html',
  styleUrls: ['./quap-overview.component.scss']
})
export class QuapOverviewComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'QuapOverviewComponent';

  values: number[];

  constructor(
    widgetTypeService: WidgetTypeService,
  ) {
    super(widgetTypeService, QuapOverviewComponent);
  }

  get departmentCount(): number {
    return this.chartData.length;
  }

  ngOnInit(): void {
    const dataArray = this.chartData as { answers: AnswerStack, computedAnswers: AnswerStack }[];

    const summaries: Summary[] = [];

    dataArray.forEach(data => {
      summaries.push(CalculationHelper.calculateSummary(CalculationHelper.combineAnswerStacks(data.answers, data.computedAnswers), false));
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
  }

}
