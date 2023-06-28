import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';

@Component({
  selector: 'app-role-overview',
  templateUrl: './role-overview.component.html',
  styleUrls: ['./role-overview.component.scss']
})
export class RoleOverviewComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME =  'RoleOverviewComponent';

  constructor(protected widgetTypeService: WidgetTypeService) {
    super(widgetTypeService, RoleOverviewComponent);
  }

  ngOnInit(): void {
    console.log('Role Overview');
  }

}
