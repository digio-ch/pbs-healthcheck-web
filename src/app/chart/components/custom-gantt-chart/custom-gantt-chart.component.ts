import {Component, Input, OnInit} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-moment';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-custom-gantt-chart',
  templateUrl: './custom-gantt-chart.component.html',
  styleUrls: ['./custom-gantt-chart.component.scss']
})
export class CustomGanttChartComponent implements OnInit {

  title = 'ng2-charts-demo';

  public barChartLegend = false;
  public barChartPlugins = [ DataLabelsPlugin ];

  @Input() datasets: [{data: Data[]}];
  @Input() labels: string[];


  constructor() {
  }

  public barChartData: ChartConfiguration<'bar', Data[]>['data'] = {
    labels: [],
    datasets: [],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
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
    // @ts-ignore
    backgroundColor: ctx => ctx.dataset.data[ctx.dataIndex].color,
    plugins: {
      datalabels: {
        color: 'white',
        anchor: 'start',
        align: 'right',
        clamp: true,
        padding: 10,
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
    this.barChartData.datasets = this.datasets;
    this.barChartData.labels = this.labels;
  }

}

interface Data {
  y: string;
  duration: string[];
  label?: string;
  color: string;
}

