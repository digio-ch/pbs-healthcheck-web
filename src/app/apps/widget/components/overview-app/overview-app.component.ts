import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DefaultFilterFacade } from 'src/app/store/facade/default-filter.facade';
import { GamificationFacade } from 'src/app/store/facade/gamification.facade';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/services/api.service';
import { Group } from 'src/app/shared/models/group';
import { TranslateService } from '@ngx-translate/core';
import { WidgetWrapperComponent } from '../widget-wrapper/widget-wrapper.component';
import { OverviewSettingsViewComponent } from '../overview-settings-view/overview-settings-view.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-overview-app',
    templateUrl: './overview-app.component.html',
    styleUrls: ['./overview-app.component.scss'],
    imports: [WidgetWrapperComponent, OverviewSettingsViewComponent, AsyncPipe]
})
export class OverviewAppComponent implements OnInit, OnDestroy {
  @ViewChild('settingsView', { static: true }) settingsView: TemplateRef<any>;

  private destroyed$ = new Subject();

  sharing: boolean

  constructor(
    private apiService: ApiService,
    private widgetFacade: WidgetFacade,
    private filterFacade: DefaultFilterFacade,
    private groupFacade: GroupFacade,
    private gamificationFacde: GamificationFacade,
    private translateService: TranslateService,
  ) {
  }

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

    // // load sharing state
    this.groupFacade.getCurrentGroup$().pipe(
      first(),
      switchMap(group =>
          this.loadSharing$(group.id)
      ),
    ).subscribe();

    // fetch widget data as soon as the filter is initialized
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.filterFacade.getUpdates$(),
    ]).pipe(
      takeUntil(this.destroyed$),
      filter(() => this.filterFacade.isInitialized()),

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
    this.filterFacade.getUpdates$().pipe(
      takeUntil(this.destroyed$),
      filter(() => this.filterFacade.isInitialized()),
    ).subscribe((e) =>
      this.gamificationFacde.logDateFilterChanges(e)
    );

    // log group and people filter changes for gamification

    // after initializing the getUpdates$ is called once or more
    // to prevent the logging without user input we have to ignore the update if
    // - it is the first one (after initialization) -> skip(1)
    // - it wasn't triggered by the user (filters haven't changed) -> distinctUntilChanged
    this.filterFacade.getUpdates$()
    .pipe(
      takeUntil(this.destroyed$),
      filter(() => this.filterFacade.isInitialized()),
      distinctUntilChanged((a,b) =>
        a.groupTypes.toString() === b.groupTypes.toString() &&
        a.peopleTypes.toString() === b.peopleTypes.toString()
      ),
      skip(1),
    )
    .subscribe((e) =>
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
        this.sharing = sharing;
      })
    )
  }

  isOwner$(): Observable<boolean> {
    return this.groupFacade.getCurrentGroup$().pipe(
      map(group => group.permissionType === Group.PERMISSION_TYPE_OWNER),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
