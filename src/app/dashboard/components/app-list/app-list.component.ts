import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppModel } from 'src/app/models/app.model';
import { DashBoardSection } from 'src/app/models/dashboard-layout.model';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent {
  @Input() layout: DashBoardSection[];

  constructor(private router: Router) { }

  goTo(app: AppModel): void {
    this.router.navigate(['app', app.path]);
  }

  getTranslationKey(app: AppModel): string {
    return `apps.${app.translationKey}.name`;
  }
}
