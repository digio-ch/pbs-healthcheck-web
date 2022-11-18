import {Component, OnInit} from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {transformLineChartDate} from '../../../../../chart/utils/chart-format.util';
import {getTotalCount} from '../../../../../chart/utils/pie-char.util';

@Component({
  selector: 'app-members-group',
  templateUrl: './members-group.component.html',
  styleUrls: ['./members-group.component.scss']
})
export class MembersGroupComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'MembersGroupComponent';

  colorScheme = {
    domain: []
  };

  constructor(protected widgetTypeService: WidgetTypeService) {
    super(widgetTypeService, MembersGroupComponent);
  }

  ngOnInit(): void {
    if (this.isRange) {
      transformLineChartDate(this.chartData);
    }
    super.ngOnInit();
    for (const item of this.chartData) {
      this.colorScheme.domain.push(item.color);
    }
  }

  getTotal(tooltipModel: any) {
    return getTotalCount(this.isRange, this.chartData, tooltipModel);
  }
}
