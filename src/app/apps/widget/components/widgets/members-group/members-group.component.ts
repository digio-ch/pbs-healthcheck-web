import { Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { fillInMissingDates, isEmptyLineChart } from '../../../../../chart/utils/chart-format.util';
import { getTotalCount } from '../../../../../chart/utils/pie-char.util';
import { Color, LegendPosition, LineChartModule } from '@swimlane/ngx-charts';

import { InfoComponent } from '../../../../../shared/components/info/info.component';
import { CustomPieChartComponent } from '../../../../../chart/components/custom-pie-chart/custom-pie-chart.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { useElementSize } from 'src/app/hooks/use-element-size';
import { CustomLineChartComponent } from "src/app/chart/components/custom-line-chart/custom-line-chart.component";

@Component({
    selector: 'app-members-group',
    templateUrl: './members-group.component.html',
    styleUrls: ['./members-group.component.scss'],
    imports: [InfoComponent, LineChartModule, CustomPieChartComponent, TranslatePipe, CustomLineChartComponent]
})
export class MembersGroupComponent extends WidgetComponent {
  private translateService = inject(TranslateService);

  readonly wrapperRef = viewChild<ElementRef>('chartContainer');
  private wrapperSize = useElementSize(this.wrapperRef);

  public static WIDGET_CLASS_NAME = 'MembersGroupComponent';

  lineColorScheme: any = {
    domain: ['#1a1a1a']
  };

  legendPosition = LegendPosition.Below;

  readonly departmentsTranslation = this.translateService.translate('departments.many');

  readonly isEmpty = computed(() => {
    return isEmptyLineChart(this.chartData, this.dateSelection().isRange);
  });

  readonly filledChartData = computed(() => {
    const selection = this.dateSelection();
    const availableDates = this.availableDates();

    if (!selection.isRange) {
      return this.chartData;
    }

    return fillInMissingDates(this.chartData, selection, availableDates);
  });

  readonly areaData = computed(() => {
    return this.filledChartData().filter(data => data.name !== 'departments');
  });

  readonly lineData = computed(() => {
    return this.filledChartData()
      .filter(data => data.name === 'departments')
      .map(data => ({
        ...data,
        name: this.departmentsTranslation(),
      }));
  });

  readonly colorScheme = computed(() => ({
    domain: this.areaData().map(data => data.color)
  }) as Color);

  readonly size = computed<[number, number]>(() => {
    let widthModifier = 0;

    // create some padding when the second y axis is present
    if (this.lineData()?.length > 0) {
      widthModifier = -54;
    }

    const [width, height] = this.wrapperSize();

    const computedWidth = Math.max(0, width + widthModifier);
    
    return [computedWidth, height];
  });

  constructor() {
    const widgetTypeService = inject(WidgetTypeService);

    super();
  
    this.widgetTypeService = widgetTypeService;
  }

  getTotal(tooltipModel: any) {
    return getTotalCount(this.isRange(), this.chartData, tooltipModel);
  }
}
