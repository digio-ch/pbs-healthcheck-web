import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';
import { fillInMissingDates, formatTickDate, isEmptyLineChart } from '../../../../../chart/utils/chart-format.util';
import { getTotalCount } from '../../../../../chart/utils/pie-char.util';

import { InfoComponent } from '../../../../../shared/components/info/info.component';
import { AreaChartModule } from '@swimlane/ngx-charts';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CustomPieChartComponent } from '../../../../../chart/components/custom-pie-chart/custom-pie-chart.component';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { CustomAreaChartStackedComponent } from "src/app/chart/components/custom-area-chart-stacked/custom-area-chart-stacked.component";
import { useElementSize } from 'src/app/hooks/use-element-size';

@Component({
    selector: 'app-members-gender',
    templateUrl: './members-gender.component.html',
    styleUrls: ['./members-gender.component.scss'],
    imports: [InfoComponent, AreaChartModule, CustomPieChartComponent, TranslatePipe, CustomAreaChartStackedComponent]
})
export class MembersGenderComponent extends WidgetComponent {
  private translateService = inject(TranslateService);

  readonly wrapperRef = viewChild.required<ElementRef>('chartContainer');
  private wrapperSize = useElementSize(this.wrapperRef);

  public static WIDGET_CLASS_NAME = 'MembersGenderComponent';

  colorScheme: any = {
    domain: ['#6f6f6f', '#ffffff', '#c9c9c9']
  };

  lineColorScheme: any = {
    domain: ['#1a1a1a']
  };

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
    return this.filledChartData().filter(data => data.name !== 'departments')
  });

  readonly lineData = computed(() => {
    return this.filledChartData()
      .filter(data => data.name === 'departments')
      .map(data => ({
        ...data,
        name: this.departmentsTranslation(),
      }));
  });

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

  formatDate(date: Date): string {
    return formatTickDate(date, 'MMMM YYYY');
  }

  getTotal(tooltipModel: any) {
    return getTotalCount(this.isRange(), this.chartData, tooltipModel);
  }
}
