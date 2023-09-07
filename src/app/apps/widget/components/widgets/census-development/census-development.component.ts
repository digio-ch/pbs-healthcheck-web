import {Component, OnInit, ViewChild} from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration} from 'chart.js';

@Component({
  selector: 'app-census-development',
  templateUrl: './census-development.component.html',
  styleUrls: ['./census-development.component.scss']
})
export class CensusDevelopmentComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CensusDevelopmentComponent';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  scaleType = 'absolute';
  chartAxisLabelModifier = '';
  public chartLegend = true;
  public chartPlugins = [];
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [2017, 2018, 2019, 2020, 2021, 2022],
    datasets: exampleData.absolute
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
  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService
  ) {
    super(widgetTypeService, CensusDevelopmentComponent);
  }

  ngOnInit(): void {
  }

  toggleScaleType() {
    if (this.scaleType === 'absolute') {
      this.scaleType = 'relative';
      this.lineChartData.datasets = exampleData.relative;
      this.chartAxisLabelModifier = '%';
    } else {
      this.scaleType = 'absolute';
      this.lineChartData.datasets = exampleData.absolute;
      this.chartAxisLabelModifier = '';
    }
    this.chart.update();
  }
}

const exampleData = {
  absolute: [
    {
      label: 'Group 1',
      data: [100, 111, 108, 120, 124, 140]
    },
    {
      label: 'Group 2',
      data: [70, null, 110, null, 114, 116]
    }
  ],
  relative: [
    {
      label: 'Group 1',
      data: [0, 11, 8, 20, 24, 40]
    },
    {
      label: 'Group 2',
      data: [0, -12, 15, 20, 31, 33]
    }
  ]
};
