import { Component, OnInit } from '@angular/core';
import {DefaultFilterFacade} from '../../../../../store/facade/default-filter.facade';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';

@Component({
  selector: 'app-camps',
  templateUrl: './camps.component.html',
  styleUrls: ['./camps.component.scss']
})
export class CampsComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CampsComponent';

  colorScheme = {
    domain: []
  };

  constructor(protected widgetTypeService: WidgetTypeService) {
    super(widgetTypeService, CampsComponent);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.findColorsInDataSet();
    console.log('done');
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
