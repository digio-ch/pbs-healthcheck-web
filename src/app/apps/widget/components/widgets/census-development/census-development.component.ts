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
    let sourceData = [];

    if (this.scaleType === 'absolute') {
      this.scaleType = 'relative';
      sourceData = this.chartData.relative;
      this.chartAxisLabelModifier = '%';
    } else {
      this.scaleType = 'absolute';
      sourceData = this.chartData.absolute;
      this.chartAxisLabelModifier = '';
    }

    this.lineChartData.datasets = sourceData.map((dataset: any) => ({
      ...dataset,
      borderColor: dataset.color,
      backgroundColor: dataset.color,
      pointBackgroundColor: dataset.color,
      pointBorderColor: dataset.color
    }));

    this.chart?.update();
  }
}
