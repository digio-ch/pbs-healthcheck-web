import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { CensusFilterService } from 'src/app/store/services/census-filter.service';
import { WidgetWrapperComponent } from '../widget-wrapper/widget-wrapper.component';

@Component({
    selector: 'app-census-app',
    templateUrl: './census-app.component.html',
    styleUrls: ['./census-app.component.scss'],
    imports: [WidgetWrapperComponent]
})
export class CensusAppComponent implements OnInit,OnDestroy {
  private widgetFacade = inject(WidgetFacade);
  private groupFacade = inject(GroupFacade);
  private censusFilterService = inject(CensusFilterService);


  private destroyed$ = new Subject();

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
