import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { CensusFilterService } from 'src/app/store/services/census-filter.service';

@Component({
    selector: 'app-census-app',
    templateUrl: './census-app.component.html',
    styleUrls: ['./census-app.component.scss'],
    standalone: false
})
export class CensusAppComponent implements OnInit,OnDestroy {

  private destroyed$ = new Subject();

  constructor(
    private widgetFacade: WidgetFacade,
    private groupFacade: GroupFacade,
    private censusFilterService: CensusFilterService,
  ) {
  }

  ngOnInit(): void {
    // load census filter
    this.groupFacade.getCurrentGroup$().pipe(
      first(),
      switchMap(group => 
        this.censusFilterService.loadFilterData(group)
      ),
    ).subscribe();

    // fetch census widget data as soon as the filter is initialized
    combineLatest([
      this.groupFacade.getCurrentGroup$(),
      this.censusFilterService.getUpdates$(),
    ]).pipe(
      takeUntil(this.destroyed$),
      filter(() => this.censusFilterService.isInitialized()),

      switchMap(([group, filterState]) => 
        this.widgetFacade.refreshCensusData(group, filterState),
      )
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
