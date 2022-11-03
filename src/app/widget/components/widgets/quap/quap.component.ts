import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {AnswerOption, AnswerStack} from '../../../../apps/quap/models/question';
import {CalculationHelper} from '../../../../apps/quap/services/calculation.helper';

@Component({
  selector: 'app-quap',
  templateUrl: './quap.component.html',
  styleUrls: ['./quap.component.scss']
})
export class QuapComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'QuapComponent';

  values: number[];

  constructor(
    widgetTypeService: WidgetTypeService,
  ) {
    super(widgetTypeService, QuapComponent);
  }

  ngOnInit(): void {
    const data = this.chartData as { answers: AnswerStack, computedAnswers: AnswerStack };
    const processed = CalculationHelper.combineAnswerStacks(data.answers, data.computedAnswers);

    this.values = CalculationHelper.calculateSummary(processed, true);
  }

}
