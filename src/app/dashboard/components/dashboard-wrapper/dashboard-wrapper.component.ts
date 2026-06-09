import { Component } from '@angular/core';
import { AppListComponent } from '../app-list/app-list.component';

@Component({
    selector: 'app-dashboard-wrapper',
    templateUrl: './dashboard-wrapper.component.html',
    styleUrls: ['./dashboard-wrapper.component.scss'],
    imports: [AppListComponent]
})
export class DashboardWrapperComponent {
  constructor() {
  }
}

