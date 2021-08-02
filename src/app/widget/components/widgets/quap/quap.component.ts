import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from "../widget/widget.component";
import {WidgetTypeService} from "../../../services/widget-type.service";

@Component({
  selector: 'app-quap',
  templateUrl: './quap.component.html',
  styleUrls: ['./quap.component.scss']
})
export class QuapComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'QuapComponent';

  constructor(
    widgetTypeService: WidgetTypeService,
  ) {
    super(widgetTypeService, QuapComponent);
  }

  ngOnInit(): void {
  }

}
