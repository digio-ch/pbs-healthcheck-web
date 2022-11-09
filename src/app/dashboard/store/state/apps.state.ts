import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AppModel} from '../../../models/app.model';
import {Injectable, OnDestroy} from '@angular/core';
import {GroupFacade} from '../../../store/facade/group.facade';
import {takeUntil} from 'rxjs/operators';
import {GroupType} from '../../../shared/models/group-type';

@Injectable({
  providedIn: 'root',
})
export class AppsState implements OnDestroy {
  private availableApps: AppModel[] = [
    {
      name: 'overview',
      translationKey: 'overview',
      path: 'widgets',
      groupTypeIds: [GroupType.DEPARTMENT],
    },
    {
      name: 'quap',
      translationKey: 'quap',
      path: 'quap',
      groupTypeIds: [GroupType.CANTONAL, GroupType.REGIONAL, GroupType.DEPARTMENT],
    },
    {
      name: 'quap-departments',
      translationKey: 'quap-departments',
      path: 'quap-departments',
      groupTypeIds: [GroupType.FEDERAL, GroupType.CANTONAL, GroupType.REGIONAL],
    },
  ];

  private apps = new BehaviorSubject<AppModel[]>([]);

  private destroyed$ = new Subject();

  constructor(
    private groupFacade: GroupFacade,
  ) {
    groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => {
      this.apps.next(this.availableApps.filter(app => app.groupTypeIds.includes(group.groupType.id)));
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
