import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-age-group-demographic',
  templateUrl: './age-group-demographic.component.html',
  styleUrls: ['./age-group-demographic.component.scss']
})
export class AgeGroupDemographicComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'AgeGroupDemographicComponent';

unknownGenderCount: number;
  colorScheme = {
    domain: []
  };

  constructor(
    protected widgetTypeService: WidgetTypeService,
    private translate: TranslateService
  ) {
    super(widgetTypeService, AgeGroupDemographicComponent);
  }

  ngOnInit(): void {
    this.unknownGenderCount = this.chartData.unknownGenderCount;
    this.chartData = this.chartData.data;

    this.translate.get('chart.age-demographic-older').pipe(first()).subscribe(res => {
      this.chartData[this.chartData.length - 1].name = this.chartData[this.chartData.length - 1].name + ' ' + res;
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
