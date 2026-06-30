import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DefaultFilterFacade } from 'src/app/store/facade/default-filter.facade';
import { GamificationFacade } from 'src/app/store/facade/gamification.facade';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, first, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/services/api.service';
import { Group } from 'src/app/shared/models/group';
import { TranslateService } from '@ngx-translate/core';
import { WidgetWrapperComponent } from '../widget-wrapper/widget-wrapper.component';
import { OverviewSettingsViewComponent } from '../overview-settings-view/overview-settings-view.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DepartmentFilterComponent } from "src/app/shared/components/filters/department-filter/department-filter.component";

@Component({
    selector: 'app-overview-app',
    templateUrl: './overview-app.component.html',
    styleUrls: ['./overview-app.component.scss'],
    imports: [WidgetWrapperComponent, OverviewSettingsViewComponent, DepartmentFilterComponent]
})
export class OverviewAppComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private widgetFacade = inject(WidgetFacade);
  readonly filterFacade = inject(DefaultFilterFacade);
  private groupFacade = inject(GroupFacade);
  private gamificationFacde = inject(GamificationFacade);
  private translateService = inject(TranslateService);

  private destroyed$ = new Subject();

  readonly sharing = signal(false);
  readonly isOwner = toSignal(
    this.groupFacade.getCurrentGroup$().pipe(
      map(group => group.permissionType === Group.PERMISSION_TYPE_OWNER),
    ),
    {
      initialValue: false,
    }
  );
  readonly isFilterLoading = toSignal(
    this.filterFacade.isLoading$(),
    {
      initialValue: true,
    }
  );

  ngOnInit(): void {
    const langSwitch$ = merge(
      of(null), // trigger if the page is loaded after the initial onLangChange
      this.translateService.onLangChange
    );

    // load filter data
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      langSwitch$,
    ]).pipe(
      takeUntil(this.destroyed$),
      switchMap(([group]) => this.filterFacade.loadFilterData(group)),
    ).subscribe();

    // load sharing state
    this.groupFacade.getCurrentGroup$().pipe(
      first(),
      switchMap(group =>
          this.loadSharing$(group.id)
      ),
    ).subscribe();

    // fetch widget data as soon as the filter is initialized
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.filterFacade.getFilterState$(),
    ]).pipe(
      takeUntil(this.destroyed$),
      switchMap(([group, filterState]) =>
        this.widgetFacade.refreshOverviewData(
          filterState.dateSelection,
          group,
          filterState.peopleTypes,
          filterState.groupTypes,
        ),
      )
    ).subscribe();

    // log date filter changes for gamification
    this.filterFacade.getFilterState$().pipe(
      takeUntil(this.destroyed$),
      skip(1), // ignore initial emition
    ).subscribe((e) =>
      this.gamificationFacde.logDateFilterChanges(e)
    );

    // log group and people filter changes for gamification
    this.filterFacade.getFilterState$().pipe(
      takeUntil(this.destroyed$),
      distinctUntilChanged((a,b) =>
        a.groupTypes.toString() === b.groupTypes.toString() &&
        a.peopleTypes.toString() === b.peopleTypes.toString()
      ), // only react when the group types and people types have actually changed
      skip(1), // ignore initial emition
    ).subscribe((e) =>
      this.gamificationFacde.logGroupAndPeopleFilterChanges(e),
    );
  }

  private loadSharing$(groupId: number): Observable<boolean> {
    return this.handleShareResponse(
      this.apiService.get(`groups/${groupId}/app/overview/share`)
    )
  }

  updateSharing(sharing: boolean) {
    return this.groupFacade.getCurrentGroup$().pipe(
      first(),
      switchMap(group =>
          this.handleShareResponse(
            this.apiService.post(`groups/${group.id}/app/overview/share`, {
              share: sharing
            })
          )
      ),
    ).subscribe();
  }

  private handleShareResponse(request: Observable<any>): Observable<boolean> {
    return request.pipe(
      map((res: {sharing: boolean}) => res.sharing),
      tap(sharing => {
        this.sharing.set(sharing);
      })
    )
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
