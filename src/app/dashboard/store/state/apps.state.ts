import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppModel } from '../../../models/app.model';
import { Group } from '../../../shared/models/group';
import { GroupType } from '../../../shared/models/group-type';
import { GroupFacade } from '../../../store/facade/group.facade';

@Injectable({
  providedIn: 'root',
})
export class AppsState implements OnDestroy {
  private availableApps: AppModel[] = [
    {
      name: 'overview',
      translationKey: 'overview',
      path: 'health',
      groupTypes: [
        GroupType.DEPARTMENT_KEY,
      ],
      requiredPermission: [
        Group.PERMISSION_TYPE_OWNER,
        Group.PERMISSION_TYPE_EDITOR_PLUS,
        Group.PERMISSION_TYPE_EDITOR,
        Group.PERMISSION_TYPE_VIEWER,
      ],
    },
    {
      name: 'quap',
      translationKey: 'quap',
      path: 'quap',
      groupTypes: [
        GroupType.CANTONAL_KEY,
        GroupType.REGIONAL_KEY,
        GroupType.DEPARTMENT_KEY,
      ],
      requiredPermission: [
        Group.PERMISSION_TYPE_OWNER,
        Group.PERMISSION_TYPE_EDITOR_PLUS,
        Group.PERMISSION_TYPE_EDITOR,
        Group.PERMISSION_TYPE_VIEWER,
      ],
    },
    {
      name: 'quap-departments',
      translationKey: 'quap-departments',
      path: 'quap-departments',
      groupTypes: [
        GroupType.FEDERAL_KEY,
        GroupType.CANTONAL_KEY,
        GroupType.REGIONAL_KEY,
      ],
      requiredPermission: [
        Group.PERMISSION_TYPE_OWNER,
        Group.PERMISSION_TYPE_EDITOR_PLUS,
      ],
    },
    {
      name: 'census',
      translationKey: 'census',
      path: 'census',
      groupTypes: [
        GroupType.CANTONAL_KEY,
        GroupType.REGIONAL_KEY,
      ],
      requiredPermission: [
        Group.PERMISSION_TYPE_OWNER,
        Group.PERMISSION_TYPE_EDITOR_PLUS,
        Group.PERMISSION_TYPE_EDITOR,
        Group.PERMISSION_TYPE_VIEWER,
      ],
    },
    {
      name: 'overview-departments',
      translationKey: 'overview-departments',
      path: 'health-departments',
      groupTypes: [
        GroupType.CANTONAL_KEY,
        GroupType.REGIONAL_KEY,
      ],
      requiredPermission: [
        Group.PERMISSION_TYPE_OWNER,
        Group.PERMISSION_TYPE_EDITOR_PLUS,
      ],
    }
  ];

  private apps = new BehaviorSubject<AppModel[]>([]);

  private destroyed$ = new Subject();

  constructor(
    groupFacade: GroupFacade,
  ) {
    groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => {
      this.apps.next(this.availableApps.filter(app => app.groupTypes.includes(group.groupType.groupType)));
    });
  }

  public getApps$(): Observable<AppModel[]> {
    return this.apps.asObservable();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
