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
    this.filterService.registerFilteredMembersChart(exampleData, this.updateChart);
    this.updateChart([]);
  }

  public updateChart(chartData: any) {
    this.barChartData.datasets = [
      {
        data: [
          {
            x: 'Example group 1',
            y: 10,
            color: '#929292'
          },
          {
            x: 'Example group 2',
            y: 8,
            color: '#929292'
          }
        ]
      },
      {
        data: [
          {
            x: 'Example group 1',
            y: 5,
            color: '#d9b826'
          },
          {
            x: 'Example group 2',
            y: 6,
            color: '#d9b826'
          }
        ]
      },
      {
        data: [
          {
            x: 'Example group 1',
            y: 7,
            color: '#DD1F19'
          },
          {
            x: 'Example group 2',
            y: 3,
            color: '#DD1F19'
          }
        ]
      },
      {
        data: [
          {
            x: 'Example group 1',
            y: 7,
            color: '#1DA650'
          },
          {
            x: 'Example group 2',
            y: 7,
            color: '#1DA650'
          }
        ]
      },
      {
        data: [
          {
            x: 'Example group 1',
            y: 2,
            color: '#9A7A54'
          },
          {
            x: 'Example group 2',
            y: 6,
            color: '#9A7A54'
          }
        ]
      },
      {
        data: [
          {
            x: 'Example group 1',
            y: 7,
            color: '#3BB5DC'
          },
          {
            x: 'Example group 2',
            y: 6,
            color: '#3BB5DC'
          }
        ]
      },
      {
        data: [
          {
            x: 'Example group 1',
            y: 5,
            color: '#EEE09F'
          },
          {
            x: 'Example group 2',
            y: 6,
            color: '#EEE09F'
          }
        ]
      },
    ];
    this.chart.update();
  }
}

const exampleData = [
  {
    id: 1,
    name: 'Example group 1',
    biber: {
      m: 7,
      f: 5
    },
    woelfe: {
      m: 5,
      f: 6
    },
    pfadis: {
      m: 3,
      f: 10
    },
    rover: {
      m: 7,
      f: 12
    },
    pio: {
      m: 8,
      f: 5
    },
    pta: {
      m: 3,
      f: 2
    },
    leiter: {
      m: 6,
      f: 8
    }
  },
  {
    id: 2,
    name: 'Example group 2',
    biber: {
      m: 10,
      f: 6
    },
    woelfe: {
      m: 7,
      f: 10
    },
    pfadis: {
      m: 5,
      f: 13
    },
    rover: {
      m: 3,
      f: 5
    },
    pio: {
      m: 10,
      f: 3
    },
    pta: {
      m: 3,
      f: 2
    },
    leiter: {
      m: 15,
      f: 4
    }
  },
  {
    id: 3,
    name: 'Example group 3',
    biber: {
      m: 10,
      f: 10
    },
    woelfe: {
      m: 2,
      f: 7
    },
    pfadis: {
      m: 5,
      f: 10
    },
    rover: {
      m: 10,
      f: 14
    },
    pio: {
      m: 9,
      f: 9
    },
    pta: {
      m: 5,
      f: 7
    },
    leiter: {
      m: 10,
      f: 12
    }
  },
];
