import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { WidgetComponent } from '../widget/widget.component';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import { GroupFacade } from '../../../../../store/facade/group.facade';
import { lastValueFrom, Subject } from 'rxjs';

@Component({
    selector: 'app-census-treemap',
    templateUrl: './census-treemap.component.html',
    styleUrls: ['./census-treemap.component.scss'],
    imports: [TranslatePipe, BaseChartDirective]
})
export class CensusTreemapComponent extends WidgetComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  protected groupFacade = inject(GroupFacade);

  public static WIDGET_CLASS_NAME = 'CensusTreemapComponent';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  private destroyed$: Subject<boolean> = new Subject();

  constructor() {
    super();
    Chart.register(TreemapController, TreemapElement);
  }

  private tooltipText;

  public chartLegend = false;
  public chartPlugins = [];
  public lineChartData: any = {
    datasets: [{
      tree: [],
      key: 'value',
      groups: ['region', 'name'],
      spacing: 2,
      backgroundColor: (ctx) => {
        if (ctx.type !== 'data' || !ctx.raw || !ctx.raw._data) {
          return 'transparent';
        } else if (!ctx.raw._data.name) {
          return 'rgb(236,236,236)';
        }
        return ctx.raw._data.children?.[0]?.color || 'transparent';
      },
      labels: {
        align: 'center',
        display: true,
        formatter: (ctx) => ctx.raw?._data?.name || ''
      }
    }]
  };
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        position: 'nearest' as const,
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
    lastValueFrom(
      this.translateService.get('apps.census.treemap.tooltip-label')
    ).then((next: any) => {this.tooltipText = next; });
    this.updateChart(this.chartData.data);
  }

  get year() {
    return this.chartData.year || new Date().getFullYear();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  updateChart(chartData: any) {
    this.lineChartData.datasets[0].tree = chartData;
    this.chart?.update();
  }

}
