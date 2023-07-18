import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositiveStackedBarChartComponent } from './components/positive-stacked-bar-chart/positive-stacked-bar-chart.component';
import {ChartCommonModule, NgxChartsModule} from '@swimlane/ngx-charts';
import { CustomPieChartComponent } from './components/custom-pie-chart/custom-pie-chart.component';
import { CustomSeriesVerticalComponent } from './components/custom-series-vertical/custom-series-vertical.component';
import { CustomBarVerticalStackedChartComponent } from './components/custom-bar-vertical-stacked-chart/custom-bar-vertical-stacked-chart.component';
import {CustomGanttChartComponent} from './components/custom-gantt-chart/custom-gantt-chart.component';
import {NgChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [
    PositiveStackedBarChartComponent,
    CustomPieChartComponent,
    CustomSeriesVerticalComponent,
    CustomBarVerticalStackedChartComponent,
    CustomGanttChartComponent
  ],
    exports: [
        PositiveStackedBarChartComponent,
        CustomPieChartComponent,
        CustomSeriesVerticalComponent,
        CustomBarVerticalStackedChartComponent,
        CustomGanttChartComponent
    ],
  imports: [
    CommonModule,
    ChartCommonModule,
    NgxChartsModule,
    NgChartsModule
  ]
})
export class ChartModule { }
