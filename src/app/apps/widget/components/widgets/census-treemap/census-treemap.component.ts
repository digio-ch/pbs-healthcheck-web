import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';
import {WidgetComponent} from '../widget/widget.component';
import {BaseChartDirective} from 'ng2-charts';
import {Chart, ChartConfiguration} from 'chart.js';
import {TreemapController, TreemapElement} from 'chartjs-chart-treemap';
import {GroupFacade} from '../../../../../store/facade/group.facade';
import {first, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-census-treemap',
  templateUrl: './census-treemap.component.html',
  styleUrls: ['./census-treemap.component.scss']
})
export class CensusTreemapComponent extends WidgetComponent implements OnInit, OnDestroy {
  public static WIDGET_CLASS_NAME = 'CensusTreemapComponent';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  private destroyed$: Subject<boolean> = new Subject();

  protected year = new Date().getFullYear();
  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService,
    protected groupFacade: GroupFacade,
  ) {
    super(widgetTypeService, CensusTreemapComponent);
    Chart.register(TreemapController, TreemapElement);
  }

  private tooltipText;

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
        align: 'center',
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
        enabled: true,
        footerFont: {
          weight: 'normal'
        },
        callbacks: {
          title: (ctx) => ctx[1]?.raw?._data.label || ctx[0]?.raw?._data.label,
          label: () => '',
          footer: (ctx) => `${this.tooltipText} ${ctx[1]?.raw?._data.value || ctx[0]?.raw?._data.value}`
        }
      }
    }
  };

  ngOnInit(): void {
    this.translateService.get('apps.census.treemap.tooltip-label').toPromise().then((next) => {this.tooltipText = next; });
    this.updateChart(this.chartData);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  updateChart(chartData: any) {
    this.lineChartData.datasets[0].tree = chartData;
    this.chart.update();
  }

}
