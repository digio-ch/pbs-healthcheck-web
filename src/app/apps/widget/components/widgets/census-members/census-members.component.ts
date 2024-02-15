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

  private colorToGroup = {
    '#EEE09F' : 'biber',
    '#3BB5DC' : 'woelfe',
    '#9A7A54' : 'pfadis',
    '#1DA650' : 'rover',
    '#DD1F19' : 'pio',
    '#d9b826' : 'pta',
    '#005716' : 'leiter'
  };
  private filterTranslator;

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
        enabled: true,
        footerFont: {
          weight: 'normal'
        },
        callbacks: {
          label: () => '',
          // @ts-ignore
          footer: (ctx) => `${this.filterTranslator[this.colorToGroup[ctx[0].raw.color]]}: ${ctx[0].raw.y}`
        }
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
  ) {
    super(widgetTypeService, CensusMembersComponent);
    this.translateService.get('filter').toPromise().then(next => {
      this.filterTranslator = next;
    });
  }

  get year() {
    return this.chartData.year || new Date().getFullYear();
  }
  ngOnInit(): void {
    this.updateChart(this.chartData.data);
  }

  public updateChart(chartData: any) {
    this.barChartData.datasets = chartData;
    this.chart.update();
  }
}
