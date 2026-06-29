import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { first, skip, switchMap, takeUntil } from 'rxjs/operators';
import { GroupFacade } from 'src/app/store/facade/group.facade';
import { WidgetFacade } from 'src/app/store/facade/widget.facade';
import { CensusFilterService } from 'src/app/store/services/census-filter.service';
import { WidgetWrapperComponent } from '../widget-wrapper/widget-wrapper.component';
import { CensusFilterComponent } from "src/app/shared/components/filters/census-filter/census-filter.component";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-census-app',
    templateUrl: './census-app.component.html',
    styleUrls: ['./census-app.component.scss'],
    imports: [WidgetWrapperComponent, CensusFilterComponent]
})
export class CensusAppComponent implements OnInit,OnDestroy {
  private widgetFacade = inject(WidgetFacade);
  private groupFacade = inject(GroupFacade);
  readonly censusFilterService = inject(CensusFilterService);


  private destroyed$ = new Subject();

  readonly isFilterLoading = toSignal(
    this.censusFilterService.isLoading$().pipe(
    ),
    {
      initialValue: true,
    }
  )

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
      this.censusFilterService.getFilterState$(),
    ]).pipe(
      takeUntil(this.destroyed$),
      switchMap(([group, filterState]) => {
        return this.widgetFacade.refreshCensusData(group, filterState);
      },
      )
    ).subscribe();

    // store new filter when changed
    this.censusFilterService.getFilterState$().pipe(
      takeUntil(this.destroyed$),
      skip(1), // ignore initial emition
      switchMap(data => this.censusFilterService.updateFilter(data)),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
