import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-moment';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {DefaultFilterFacade} from '../../../store/facade/default-filter.facade';
import {BaseChartDirective} from 'ng2-charts';
import {Dataset} from '../../../shared/adapters/role-overview.adapter';

@Component({
  selector: 'app-custom-gantt-chart',
  templateUrl: './custom-gantt-chart.component.html',
  styleUrls: ['./custom-gantt-chart.component.scss']
})
export class CustomGanttChartComponent implements OnInit {
  title = 'role-overview';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartLegend = false;
  public barChartPlugins = [ DataLabelsPlugin ];

  @Input() datasets: [{data: Data[]}];
  @Input() labels: string[];

  constructor(
    private filterFacade: DefaultFilterFacade,
  ) {
  }

  public barChartData: ChartConfiguration<'bar', Data[]>['data'] = {
    labels: [],
    datasets: [],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    parsing: {
      xAxisKey: 'duration',
      yAxisKey: 'y'
    },
    scales: {
      x: {
        min: '2014-05-01',
        type: 'time',
        time: {
          unit: 'year'
        }
      },
      y: {
        beginAtZero: true,
      }
    },
    skipNull: false, // As of 29.6.2023 this is not working properly with grouped bar charts and cartesian time axis, so I had to disable it
    // @ts-ignore
    backgroundColor: ctx => ctx.dataset.data[ctx.dataIndex].color,
    plugins: {
      datalabels: {
        color: 'white',
        anchor: 'start',
        align: 'right',
        padding: 10,
        clamp: true,
        // checks if text fits in bar.
        display: context => {
          try {
            const label = (context.chart.data.datasets[context.datasetIndex].data[context.dataIndex] as unknown as Data).label;
            const bar = context.chart.getDatasetMeta(context.datasetIndex).data[context.dataIndex];
            // @ts-ignore
            let barWidth = bar.width;
            /*
             * When chart is loaded or data changes, bars are animated and with is NaN.
             * In that case we need to get it from the animation object.
             */
            if (isNaN(barWidth)) {
              barWidth = bar.$animations.width._to;
            }
            const textWidth = context.chart.ctx.measureText(label).width;
            return textWidth > barWidth ? false : true;
          } catch (e) {
            console.log(e);
          }
          return false;
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title(tooltipItems): string | string[] | void {
            // @ts-ignore
            return tooltipItems[0].raw.label;
          },
          label(tooltipItem): string | string[] | void {
            return '';
          }
        },
      },
    }
  };


  ngOnInit(): void {
    this.setupChart();
  }

  setupChart() {
    const dateSelectionSnapshot = this.filterFacade.getDateSelectionSnapshot();
    this.barChartOptions.scales.x.min = dateSelectionSnapshot.startDate.format('Y-M-D');
    const difference = dateSelectionSnapshot.endDate.diff(dateSelectionSnapshot.startDate, 'years', true);
    // @ts-ignore
    this.barChartOptions.scales.x.time.unit = difference > 2.5 ? 'year' : 'month';
    this.updateChart(this.datasets, this.labels);
  }
  updateChart(datasets: Dataset[], labels: string[]) {
    this.barChartData.datasets = datasets;
    this.barChartData.labels = labels;
    this.chart?.update();
  }

}

interface Data {
  y: string;
  duration: string[];
  label?: string;
  color: string;
}

