import { Component, OnInit, inject } from '@angular/core';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { WidgetComponent } from '../widget/widget.component';

import { BarChartModule } from '@swimlane/ngx-charts';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-camps',
    templateUrl: './camps.component.html',
    styleUrls: ['./camps.component.scss'],
    imports: [BarChartModule, TranslatePipe]
})
export class CampsComponent extends WidgetComponent implements OnInit {
  protected widgetTypeService: WidgetTypeService;

  public static WIDGET_CLASS_NAME = 'CampsComponent';

  colorScheme: any = {
    domain: []
  };

  constructor() {
    const widgetTypeService = inject(WidgetTypeService);

    super();
  
    this.widgetTypeService = widgetTypeService;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.findColorsInDataSet();
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
}
