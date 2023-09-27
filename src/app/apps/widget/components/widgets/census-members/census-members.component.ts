import {Component, OnInit, ViewChild} from '@angular/core';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';
import {WidgetComponent} from '../widget/widget.component';
import {ChartConfiguration} from 'chart.js';
import {CensusFilterService} from '../../../../../store/services/census-filter.service';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-census-members',
  templateUrl: './census-members.component.html',
  styleUrls: ['./census-members.component.scss']
})
export class CensusMembersComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CensusMembersComponent';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  protected year = new Date().getFullYear();
  private colors = {
    biber: ['#EEE09F', '#d6ca8f'],
    woelfe: ['#3BB5DC', '#2f91b0'],
    pfadis: ['#9A7A54', '#7b6243'],
    rover: ['#1DA650', '#178540'],
    pio: ['#DD1F19', '#b11914'],
    pta: ['#d9b826', '#ae931e'],
    leiter: ['#929292', '#838383']
  };
  public barChartLegend = false;
  public barChartPlugins = [ ];

  public barChartData: ChartConfiguration<'bar', {x: string, y: number, color: string}[]>['data'] = {
    datasets: [],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: (context) => {
      // @ts-ignore
      return context.dataset.data[context.dataIndex].color;
    },
    datasets: {
      bar: {
        maxBarThickness: 100
      }
    },
    plugins: {
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      },
    }
  };

  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService,
    private filterService: CensusFilterService
  ) {
    super(widgetTypeService, CensusMembersComponent);
  }

  ngOnInit(): void {
    this.updateChart(this.chartData);
  }

  public updateChart(chartData: any) {
    this.barChartData.datasets = chartData;
    this.chart.update();
  }
}
