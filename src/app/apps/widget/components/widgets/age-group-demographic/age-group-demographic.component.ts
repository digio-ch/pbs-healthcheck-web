import { Component, OnInit, computed, inject } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { InfoComponent } from '../../../../../shared/components/info/info.component';
import { PositiveStackedBarChartComponent } from '../../../../../chart/components/positive-stacked-bar-chart/positive-stacked-bar-chart.component';

@Component({
    selector: 'app-age-group-demographic',
    templateUrl: './age-group-demographic.component.html',
    styleUrls: ['./age-group-demographic.component.scss'],
    imports: [InfoComponent, PositiveStackedBarChartComponent, AsyncPipe, TranslatePipe]
})
export class AgeGroupDemographicComponent extends WidgetComponent implements OnInit {
  protected widgetTypeService: WidgetTypeService;
  private translate = inject(TranslateService);

  public static WIDGET_CLASS_NAME = 'AgeGroupDemographicComponent';

  unknownGenderCount: number;
  colorScheme: any = {
    domain: []
  };

  readonly isEmpty = computed(() => {
    return this.chartData.every(item => item.series.length === 0);
  }); 

  constructor() {
    const widgetTypeService = inject(WidgetTypeService);

    super();
  
    this.widgetTypeService = widgetTypeService;
  }

  ngOnInit(): void {
    this.unknownGenderCount = this.chartData.unknownGenderCount;
    this.chartData = this.chartData.data;

    this.translate.get('chart.age-demographic-older').pipe(first()).subscribe(res => {
      
      const indexOfSummed = this.chartData.findIndex(item => item.isSummed);
      if (indexOfSummed === -1) {
        return;
      }

      this.chartData[indexOfSummed].name += ` ${res}`;
    });

    super.ngOnInit();
    this.findColorsInDataSet();
  }

  formatY(value) {
    if (value % 1 === 0) {
      return Math.abs(value);
    }
    return '';
  }

  findColorsInDataSet() {
    for (const year of this.chartData) {
      for (const data of year.series) {
        if (this.colorScheme.domain.includes(data.color)) {
          continue;
        }
        this.colorScheme.domain.push(data.color);
      }
    }
  }

  getGenderFromValue(value: number): Observable<string> {
    return value < 0 ? this.translate.get('gender.adjective.female') : this.translate.get('gender.adjective.male');
  }
}
