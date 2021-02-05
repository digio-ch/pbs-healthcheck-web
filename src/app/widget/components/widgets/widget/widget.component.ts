import {Component, Input, OnInit, Type} from '@angular/core';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {formatTickDate, formatTickToWholeNumber} from '../../../../chart/utils/chart-format.util';


@Component({
  selector: 'app-widget',
  template: '',
  styles: [],
})
export class WidgetComponent implements OnInit {
  @Input() chartData: any;
  @Input() isRange: boolean;

  constructor(
    protected widgetTypeService: WidgetTypeService,
    protected type: Type<WidgetComponent>
  ) {
    this.widgetTypeService.register(type.name, type);
  }

  ngOnInit() { }

  wholeNumber(value) {
    return formatTickToWholeNumber(value);
  }

  monthYearDate(value) {
    return formatTickDate(value);
  }

  yAxisTickFormatting(value: any, step = 1) {
    if (value % 1 === 0) {
      return value.toLocaleString();
    }
    return '';
  }
}
