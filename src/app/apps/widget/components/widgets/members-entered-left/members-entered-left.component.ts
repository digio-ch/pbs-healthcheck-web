import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import * as moment from 'moment';


@Component({
  selector: 'app-members-entered-left',
  templateUrl: './members-entered-left.component.html',
  styleUrls: ['./members-entered-left.component.scss']
})
export class MembersEnteredLeftComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'MembersEnteredLeftComponent';

  colorScheme = {
    domain: []
  };

  constructor(protected widgetTypeService: WidgetTypeService) {
    super(widgetTypeService, MembersEnteredLeftComponent);
  }

  ngOnInit(): void {
    // TODO: not supported for this chart type
    // transformStackedBarChartDate(this.chartData);
    super.ngOnInit();
    this.findColorsInDataSet();
  }

  findColorsInDataSet() {
    for (const year of this.chartData) {
      for (const data of year.series) {
        if (this.colorScheme.domain.includes(data.color)) {
          continue;
        }
        this.colorScheme.domain.push(data.color);
      }
    }
  }

  monthYearDate(value): string {
    return moment(value, 'DD.MM.YYYY').format('MMM YYYY');
  }
}
