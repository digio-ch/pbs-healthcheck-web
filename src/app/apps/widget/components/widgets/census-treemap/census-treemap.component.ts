import {Component, OnInit, ViewChild} from '@angular/core';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';
import {WidgetComponent} from '../widget/widget.component';
import {BaseChartDirective} from 'ng2-charts';
import {Chart, ChartConfiguration} from 'chart.js';
import {TreemapController, TreemapElement} from 'chartjs-chart-treemap';
import {GroupFacade} from '../../../../../store/facade/group.facade';

@Component({
  selector: 'app-census-treemap',
  templateUrl: './census-treemap.component.html',
  styleUrls: ['./census-treemap.component.scss']
})
export class CensusTreemapComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CensusTreemapComponent';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public chartLegend = false;
  public chartPlugins = [TreemapController, TreemapElement];
  public lineChartData = {
    datasets: [{
      tree: [],
      key: 'value',
      groups: ['region', 'name'],
      spacing: 2,
      backgroundColor: (ctx) => {
        if (ctx.type !== 'data') {
          return 'transparent';
        } else if (!ctx.raw._data.name) {
          return 'rgb(236,236,236)';
        }
        return ctx.raw._data.children[0].color;
      },
      labels: {
        align: 'left',
        display: true,
        formatter: (ctx) => ctx.raw._data.name
      }
    }]
  };
  public chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false
      }
    }
  };
  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService,
    protected groupFacade: GroupFacade,
  ) {
    super(widgetTypeService, CensusTreemapComponent);
    Chart.register(TreemapController, TreemapElement);
  }

  ngOnInit(): void {
    this.updateChart(this.chartData);
  }

  updateChart(chartData: any) {
    this.lineChartData.datasets[0].tree = chartData;
    this.chart.update();
  }

}

const exampleData = [
  {
    name: 'Gruppe 1',
    region: 'Region 1',
    value: 10,
    color: '#EEE09F'
  },
  {
    name: 'Gruppe 2',
    region: 'Region 1',
    value: 12,
    color: '#EEE09F'
  },
  {
    name: 'Gruppe 3',
    region: 'Region 1',
    value: 20,
    color: '#EEE09F'
  },
  {
    name: 'Gruppe 4',
    region: 'Region 2',
    value: 5,
    color: '#3BB5DC'
  },
  {
    name: 'Gruppe 6',
    region: 'Region 2',
    value: 5,
    color: '#3BB5DC'
  },
  {
    name: 'Gruppe 7',
    region: 'Region 2',
    value: 20,
    color: '#3BB5DC'
  },
  {
    name: 'Gruppe 8',
    region: 'Region 3',
    value: 10,
    color: '#389510'
  },
];
