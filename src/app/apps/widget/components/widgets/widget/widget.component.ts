import { Component, Input, OnInit, computed, inject, input } from '@angular/core';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { formatTickDate, formatTickToWholeNumber } from '../../../../../chart/utils/chart-format.util';
import { DateModel } from 'src/app/shared/models/date-selection/date.model';
import { DateSelection } from 'src/app/shared/models/date-selection/date-selection';


@Component({
    selector: 'app-widget',
    template: '',
    styles: []
})
export class WidgetComponent implements OnInit {
  protected widgetTypeService = inject(WidgetTypeService);

  @Input() chartData: any;
  readonly dateSelection = input.required<DateSelection>();
  readonly availableDates = input.required<DateModel[]>();

  readonly isRange = computed(() => {
    return this.dateSelection().isRange;
  })

  constructor() {
    const type = this.constructor as any;

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
