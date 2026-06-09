import { Component, OnInit } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { transformLineChartDate } from '../../../../../chart/utils/chart-format.util';
import { getTotalCount } from '../../../../../chart/utils/pie-char.util';
import { LegendPosition, LineChartModule } from '@swimlane/ngx-charts';

import { InfoComponent } from '../../../../../shared/components/info/info.component';
import { CustomPieChartComponent } from '../../../../../chart/components/custom-pie-chart/custom-pie-chart.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-members-group',
    templateUrl: './members-group.component.html',
    styleUrls: ['./members-group.component.scss'],
    imports: [InfoComponent, LineChartModule, CustomPieChartComponent, TranslatePipe]
})
export class MembersGroupComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'MembersGroupComponent';

  colorScheme: any = {
    domain: []
  };
  legendPosition = LegendPosition.Below;

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
