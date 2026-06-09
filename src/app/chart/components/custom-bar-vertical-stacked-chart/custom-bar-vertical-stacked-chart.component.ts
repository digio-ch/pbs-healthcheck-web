import { ChangeDetectorRef, Component, ElementRef, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { BarVerticalStackedComponent, ChartCommonModule, AxesModule } from '@swimlane/ngx-charts';

import { CustomSeriesVerticalComponent } from '../custom-series-vertical/custom-series-vertical.component';

@Component({
    selector: 'app-custom-bar-vertical-stacked-chart',
    templateUrl: './custom-bar-vertical-stacked-chart.component.html',
    styleUrls: ['./custom-bar-vertical-stacked-chart.component.scss'],
    imports: [ChartCommonModule, AxesModule, CustomSeriesVerticalComponent]
})
export class CustomBarVerticalStackedChartComponent extends BarVerticalStackedComponent {
  protected override chartElement: ElementRef;
  protected override zone: NgZone;
  protected override cd: ChangeDetectorRef;

  constructor() {
    const chartElement = inject(ElementRef);
    const zone = inject(NgZone);
    const cd = inject(ChangeDetectorRef);
    const platformId = inject(PLATFORM_ID);

    super(chartElement, zone, cd, platformId);
  
    this.chartElement = chartElement;
    this.zone = zone;
    this.cd = cd;
  }

  onActivate(event: any, group: any, fromLegend?: boolean) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    const items = this.results
      .map(g => g.series)
      .flat()
      .filter(i => {
        if (fromLegend) {
          return i.label === item.name;
        } else {
          return i.name === item.name && i.series === item.series && i.value === item.value;
        }
      });

    this.activeEntries = [...items];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }
}
