import { Component, OnInit } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { formatTickDate, transformLineChartDate } from '../../../../../chart/utils/chart-format.util';
import { getTotalCount } from '../../../../../chart/utils/pie-char.util';

import { InfoComponent } from '../../../../../shared/components/info/info.component';
import { AreaChartModule } from '@swimlane/ngx-charts';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CustomPieChartComponent } from '../../../../../chart/components/custom-pie-chart/custom-pie-chart.component';

@Component({
    selector: 'app-members-gender',
    templateUrl: './members-gender.component.html',
    styleUrls: ['./members-gender.component.scss'],
    imports: [InfoComponent, AreaChartModule, TranslateDirective, CustomPieChartComponent, TranslatePipe]
})
export class MembersGenderComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'MembersGenderComponent';

  colorScheme: any = {
    domain: ['#6f6f6f', '#ffffff', '#c9c9c9']
  };

  constructor(protected widgetTypeService: WidgetTypeService) {
    super(widgetTypeService, MembersGenderComponent);
  }

  ngOnInit(): void {
    if (this.isRange) {
      transformLineChartDate(this.chartData);
    }
    super.ngOnInit();
  }

  formatDate(date: Date): string {
    return formatTickDate(date, 'MMMM YYYY');
  }

  getTotal(tooltipModel: any) {
    return getTotalCount(this.isRange, this.chartData, tooltipModel);
  }
}
