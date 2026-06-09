import { Component, OnInit } from '@angular/core';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { WidgetComponent } from '../widget/widget.component';

@Component({
  selector: 'app-camps',
  templateUrl: './camps.component.html',
  styleUrls: ['./camps.component.scss']
})
export class CampsComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CampsComponent';

  colorScheme: any = {
    domain: []
  };

  constructor(protected widgetTypeService: WidgetTypeService) {
    super(widgetTypeService, CampsComponent);
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
