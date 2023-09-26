import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GroupFacade} from '../../../../../store/facade/group.facade';
import {ChartConfiguration, ChartDataset} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {CensusService} from '../../../../../store/services/census.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-census-app-preview',
  templateUrl: './census-app-preview.component.html',
  styleUrls: ['./census-app-preview.component.scss']
})
export class CensusAppPreviewComponent implements OnInit, OnDestroy {

  private colors = {
    biber: ['#EEE09F', '#d6ca8f'],
    woelfe: ['#3BB5DC', '#2f91b0'],
    pfadis: ['#9A7A54', '#7b6243'],
    rover: ['#1DA650', '#178540'],
    pio: ['#DD1F19', '#b11914'],
    pta: ['#d9b826', '#ae931e'],
    leiter: ['#929292', '#838383']
  };

  private destroyed$ = new Subject();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  protected loading = true;

  constructor(
    private censusService: CensusService,
    private groupFacade: GroupFacade
  ) { }

  public barChartLegend = false;
  public barChartPlugins = [ ];

  public barChartData: ChartConfiguration<'bar', {x: string, y: number, color: string}[]>['data'] = {
    datasets: [
      {
        data: []
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: (context) => {
      // @ts-ignore
      return context.dataset.data[context.dataIndex].color;
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
      }
    }
  };

  ngOnInit(): void {
    this.groupFacade.getCurrentGroup$()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(group => {
        this.loading = true;

        this.censusService.getPreview(group.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(data => {
            let colorIndex = 0;
            const temp = Object.values(data).map(o => {
              const mappedValues: { x: string, y: number, color: string }[] = [];
              for (const [key, value] of Object.entries(o)) {
                mappedValues.push({
                  x: key,
                  y: value,
                  color: this.colors[key][colorIndex]
                });
              }
              colorIndex++;
              return {data: mappedValues};
            });
            this.loading = false;
            this.barChartData.datasets = temp;
            this.chart?.update();
          });
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
