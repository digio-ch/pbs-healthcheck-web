import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { WidgetComponent } from '../widget/widget.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-census-development',
    templateUrl: './census-development.component.html',
    styleUrls: ['./census-development.component.scss'],
    imports: [MatSlideToggle, TranslatePipe, BaseChartDirective]
})
export class CensusDevelopmentComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CensusDevelopmentComponent';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  scaleType = 'relative';
  chartAxisLabelModifier = '';
  public chartLegend = true;
  public chartPlugins = [];
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    datasets: {
      line: {
        // @ts-ignore
        backgroundColor: (ctx) => [ctx.dataset.color],
        // @ts-ignore
        borderColor: (ctx) => [ctx.dataset.color],
        // @ts-ignore
        pointBackgroundColor: (ctx) => [ctx.dataset.color],
        // @ts-ignore
        pointBorderColor: (ctx) => [ctx.dataset.color],
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    },
    scales: {
      y: {
        ticks: {
          callback: v => v + this.chartAxisLabelModifier
        }
      }
    }
  };
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.lineChartData.labels = this.chartData.years;
    this.toggleScaleType();
  }

  toggleScaleType() {
    if (this.scaleType === 'absolute') {
      this.scaleType = 'relative';
      this.lineChartData.datasets = this.chartData.relative;
      this.chartAxisLabelModifier = '%';
    } else {
      this.scaleType = 'absolute';
      this.lineChartData.datasets = this.chartData.absolute;
      this.chartAxisLabelModifier = '';
    }
    this.chart?.update();
  }
}
