import { Component, OnInit } from '@angular/core';
import {BreadcrumbService} from '../../../shared/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss']
})
export class DashboardWrapperComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.get('dashboard').subscribe(val => {
      this.breadcrumbService.setBreadcrumbs([{
        name:  val,
        path: '/'
      }]);
    });
  }
}
