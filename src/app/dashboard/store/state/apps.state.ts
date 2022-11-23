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
      path: 'health',
      groupTypes: [GroupType.DEPARTMENT_KEY],
    },
    {
      name: 'quap',
      translationKey: 'quap',
      path: 'quap',
      groupTypes: [GroupType.CANTONAL_KEY, GroupType.REGIONAL_KEY, GroupType.DEPARTMENT_KEY],
    },
    {
      name: 'quap-departments',
      translationKey: 'quap-departments',
      path: 'quap-departments',
      groupTypes: [GroupType.FEDERAL_KEY, GroupType.CANTONAL_KEY, GroupType.REGIONAL_KEY],
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
