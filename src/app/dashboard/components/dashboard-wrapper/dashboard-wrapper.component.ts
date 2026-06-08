import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { DashBoardSection } from 'src/app/models/dashboard-layout.model';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { AppsFacade } from '../../store/facade/apps.facade';
import { combineLatest, Observable } from 'rxjs';
import { AppKey, AppModel } from 'src/app/models/app.model';
import { Group } from 'src/app/shared/models/group';

interface RawDashBoardSection {
  titleTranslationKey?: string,
  apps: AppKey[]
}

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss']
})
export class DashboardWrapperComponent {
  private readonly departmentLayout: RawDashBoardSection[] = [{
    apps: ['overview', 'quap']
  }]

  private readonly associationLayout: RawDashBoardSection[] = [
    {
      titleTranslationKey: 'dashboard.my-level',
      apps: ['quap', 'census']
    },
    {
      titleTranslationKey: 'dashboard.shared',
      apps: ['quap-departments', 'overview-departments']
    }
  ]

  readonly sections$: Observable<DashBoardSection[]> = combineLatest([
    this.appsFacade.getApps$(),
    this.groupFacade.getCurrentGroup$(),
  ]).pipe(
    map(([apps, group]) => {
      const availableApps = this.getAvailableApps(apps, group);

      const layout = group.isDepartment() 
        ? this.departmentLayout 
        : this.associationLayout;

      return this.buildSections(layout, availableApps);
    }),
  );

  constructor(
    private appsFacade: AppsFacade,
    protected groupFacade: GroupFacade,
  ) { }

  private getAvailableApps(apps: AppModel[], group: Group): AppModel[] {
    return apps.filter(
      app =>
        !app.requiredPermission ||
        app.requiredPermission.includes(group.permissionType)
    );
  }

  private buildSections(layout: RawDashBoardSection[], apps: AppModel[]): DashBoardSection[] {
    const appsByKey = new Map(
      apps.map(app => [app.key, app])
    );

    // only keep the apps that we actually have
    // remove sections that have no apps in it
    return layout
      .map(section => ({
        titleTranslationKey: section.titleTranslationKey,
        apps: section.apps
          .map(key => appsByKey.get(key))
          .filter((app) => !!app)
      }))
      .filter(section => section.apps.length > 0);
  }
}

