import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-census-table',
  templateUrl: './census-table.component.html',
  styleUrls: ['./census-table.component.scss']
})
export class CensusTableComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CensusTableComponent';

  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService
  ) {
    super(widgetTypeService, CensusTableComponent);
  }

  ngOnInit(): void {
  }

}
