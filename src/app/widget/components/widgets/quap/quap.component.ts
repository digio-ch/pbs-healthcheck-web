import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from "../widget/widget.component";
import {WidgetTypeService} from "../../../services/widget-type.service";
import {AnswerStack} from '../../../../tabs/components/tabs/quap/models/question';
import {CalculationHelper} from '../../../../tabs/components/tabs/quap/services/calculation.helper';

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
    const data = this.chartData as AnswerStack;

    this.values = CalculationHelper.calculateSummary(data, true);
  }

}
