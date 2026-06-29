import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { FilterData } from 'src/app/shared/models/filter-data';
import { DateQuickSelectionOptions } from '../../shared/models/date-selection/date-quick-selection-options';
import { DateSelection } from '../../shared/models/date-selection/date-selection';
import { DateModel } from '../../shared/models/date-selection/date.model';
import { Group } from '../../shared/models/group';
import { GroupType } from '../../shared/models/group-type';
import { PeopleType } from '../../shared/models/people-type';
import { FilterService } from '../services/filter.service';
import { DefaultFilterState } from '../state/default-filter.state';
import { DateFacade } from './date.facade';

@Injectable({
  providedIn: 'root'
})
export class DefaultFilterFacade {
  private filterState = inject(DefaultFilterState);
  private filterService = inject(FilterService);
  private dateFacade = inject(DateFacade);

  forcedUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private preventFetch = false;

  private initialized = false;

  isInitialized(): boolean {
    return this.initialized;
  }

  isLoading$(): Observable<boolean> {
    return this.filterState.isLoading$();
  }

  loadFilterData(group: Group) {
    this.preventFetch = true;
    this.filterState.setLoading(true);

    return this.processResponse(
      this.filterService.getFilterData(group),
    );
  }

  loadFilterDataForDepartment(group: Group, departmentId: number) {
    this.preventFetch = true;
    this.filterState.setLoading(true);

    return this.processResponse(
      this.filterService.getFilterDataForDepartment(group, departmentId),
    );
  }

  isPreventFetch(): boolean {
    return this.preventFetch;
  }

  setDateSelection(dateSelection: DateSelection) {
      this.dateFacade.setDateSelection(dateSelection);
  }

  getDateSelectionSnapshot(): DateSelection {
    return this.dateFacade.getDateSelectionSnapshot();
  }

  isLatestSelected(): boolean {
    return this.dateFacade.isLatestSelected();
  }

  isTodaySelected(): boolean {
    return this.dateFacade.isTodaySelected();
  }

  getDateSelection$(): Observable<DateSelection> {
    return this.dateFacade.getDateSelection$();
  }

  getAvailableDates$(): Observable<DateModel[]> {
    return this.dateFacade.getAvailableDates$();
  }

  getAvailableDateQuickSelectionOptions$(): Observable<DateQuickSelectionOptions> {
    return this.dateFacade.getAvailableDateQuickSelectionOptions$();
  }

  getAvailableDateQuickSelectionOptionsSnapshot(): DateQuickSelectionOptions {
    return this.dateFacade.getAvailableDateQuickSelectionOptionsSnapshot();
  }

  getGroupTypes$(): Observable<GroupType[]> {
    return this.filterState.getGroupTypes$();
  }

  getGroupTypesString(): string[] {
    return this.filterState.getGroupTypesStrings();
  }

  getPeopleTypes$(): Observable<PeopleType[]> {
    return this.filterState.getPeopleTypes$();
  }

  getPeopleTypesString(): string[] {
    return this.filterState.getPeopleTypesStrings();
  }

  getUpdates$(): Observable<CurrentFilterState> {
    return combineLatest([this.getDateSelection$(), this.forcedUpdate.asObservable()]).pipe(
      map(data => {
        return data[0];
      }),
      map(dateSelection => {
        return {
          dateSelection,
          peopleTypes: this.getPeopleTypesString(),
          groupTypes: this.getGroupTypesString(),
        };
      })
    );
  }

  forceUpdate(): void {
    this.forcedUpdate.next(!this.forcedUpdate.value);
  }

  private processResponse(request: Observable<FilterData>): Observable<any> {
    return request.pipe(
      first(),
      tap(filterData => {
        if (filterData.dates.length === 0) {
          return;
        }

        this.initialized = true;
        this.dateFacade.setAvailableDates(filterData.dates);
        this.filterState.setGroupTypes(filterData.groupTypes);
        // set date to today as default
        this.dateFacade.setDateSelection(new DateSelection(
          filterData.dates[0].date,
          null,
          false
        ));

        this.preventFetch = false;
        this.filterState.setLoading(false);
      }),
      catchError(err => {
        this.preventFetch = false;
        this.filterState.setLoading(false);
        return of(err);
      }),
    );
  }
}

export interface CurrentFilterState {
  dateSelection: DateSelection;
  peopleTypes: string[];
  groupTypes: string[];
}
