import { Component, OnDestroy, OnInit } from '@angular/core';
import { DefaultFilterFacade } from 'src/app/store/facade/default-filter.facade';
import { GamificationFacade } from 'src/app/store/facade/gamification.facade';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, skip, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-overview-app',
  templateUrl: './overview-app.component.html',
  styleUrls: ['./overview-app.component.scss'],
})
export class OverviewAppComponent implements OnInit, OnDestroy {

  private destroyed$ = new Subject();

  constructor(
    private widgetFacade: WidgetFacade,
    private filterFacade: DefaultFilterFacade,
    private groupFacade: GroupFacade,
    private gamificationFacde: GamificationFacade,
  ) {
  }

  ngOnInit(): void {
    // load filter
    this.groupFacade.getCurrentGroup$().pipe(
      first(),
      switchMap(group => 
        this.filterFacade.loadFilterData(group),
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
