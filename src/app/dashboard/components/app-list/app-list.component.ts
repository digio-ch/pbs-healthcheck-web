import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { AppModel } from '../../../models/app.model';
import { takeUntil } from 'rxjs/operators';
import { AppsFacade } from '../../store/facade/apps.facade';
import { Router } from '@angular/router';
import { GroupFacade } from '../../../store/facade/group.facade';

import { WidgetsAppPreviewComponent } from '../../../apps/widget/components/widgets/widgets-app-preview/widgets-app-preview.component';
import { QuapAppPreviewComponent } from '../../../apps/quap/components/quap-app-preview/quap-app-preview.component';
import { QuapDepartmentsAppPreviewComponent } from '../../../apps/quap/components/quap-departments-app-preview/quap-departments-app-preview.component';
import { CensusAppPreviewComponent } from '../../../apps/widget/components/widgets/census-app-preview/census-app-preview.component';
import { OverviewDepartmentsAppPreviewComponent } from '../../../apps/widget/components/overview-departments-app-preview/overview-departments-preview-app.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-app-list',
    templateUrl: './app-list.component.html',
    styleUrls: ['./app-list.component.scss'],
    imports: [WidgetsAppPreviewComponent, QuapAppPreviewComponent, QuapDepartmentsAppPreviewComponent, CensusAppPreviewComponent, OverviewDepartmentsAppPreviewComponent, TranslatePipe]
})
export class AppListComponent implements OnInit, OnDestroy {
  private appsFacade = inject(AppsFacade);
  protected groupFacade = inject(GroupFacade);
  private router = inject(Router);


  apps: AppModel[];

  private destroyed$ = new Subject();

  ngOnInit(): void {
    this.appsFacade.getApps$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(apps => this.apps = apps.filter(app => !app.requiredPermission ||
      app.requiredPermission.find(key => key === this.groupFacade.getCurrentGroupSnapshot().permissionType)));
  }

  goTo(app: AppModel): void {
    this.router.navigate(['app', app.path]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
