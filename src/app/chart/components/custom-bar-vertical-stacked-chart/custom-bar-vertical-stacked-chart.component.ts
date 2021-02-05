import { Component } from '@angular/core';
import {BarVerticalStackedComponent} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-custom-bar-vertical-stacked-chart',
  templateUrl: './custom-bar-vertical-stacked-chart.component.html',
  styleUrls: ['./custom-bar-vertical-stacked-chart.component.scss']
})
export class CustomBarVerticalStackedChartComponent extends BarVerticalStackedComponent {
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
