import { Injectable, inject } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, first, map, tap } from 'rxjs/operators';
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
import { Loadable } from 'src/app/shared/models/loadable';

@Injectable({
  providedIn: 'root'
})
export class DefaultFilterFacade implements Loadable {
  private filterState = inject(DefaultFilterState);
  private filterService = inject(FilterService);
  private dateFacade = inject(DateFacade);

  public isLoading$(): Observable<boolean> {
    return combineLatest([
      this.dateFacade.isLoading$(),
      this.filterState.isLoading$(),
    ]).pipe(
      map(([dateLoading, defaultFilterLoading]) => dateLoading || defaultFilterLoading),
      distinctUntilChanged(),
    );
  }

  loadFilterData(group: Group) {
    this.filterState.setLoading(true);

    return this.processResponse(
      this.filterService.getFilterData(group),
    );
  }

  loadFilterDataForDepartment(group: Group, departmentId: number) {
    this.filterState.setLoading(true);

    return this.processResponse(
      this.filterService.getFilterDataForDepartment(group, departmentId),
    );
  }

  loadMyOrganizationFilter(group: Group) {
    this.filterState.setLoading(true);

    return this.processResponse(
      this.filterService.fetchMyOrganizationFilter(group),
    );
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

  getPeopleTypes$(): Observable<PeopleType[]> {
    return this.filterState.getPeopleTypes$();
  }

  setPeopleTypeSelected(peopleType: PeopleType, selected: boolean) {
    this.filterState.setPeopleTypeSelected(peopleType, selected);
  }

  setGroupTypeSelected(groupType: GroupType, selected: boolean) {
    this.filterState.setGroupTypeSelected(groupType, selected);
  }

  getFilterState$(): Observable<CurrentFilterState> {
    return combineLatest([
      this.getDateSelection$(),
      this.filterState.getSelectedPeopleTypeNames$(),
      this.filterState.getSelectedGroupTypeNames$(),
      this.isLoading$(),
    ]).pipe(
      filter(([_, __, ___, loading]) => !loading),
      map(([dateSelection, peopleTypes, groupTypes]) => ({
        dateSelection,
        peopleTypes,
        groupTypes,
      })),
    );
  }

  private processResponse(request: Observable<FilterData>): Observable<any> {
    return request.pipe(
      first(),
      tap(filterData => {
        if (filterData.dates.length === 0) {
          return;
        }

        this.dateFacade.setAvailableDates(filterData.dates);
        this.filterState.setGroupTypes(filterData.groupTypes);
        // set date to today as default
        this.dateFacade.setDateSelection(new DateSelection(
          filterData.dates[0].date,
          null,
          false
        ));

        this.filterState.setLoading(false);
      }),
      catchError(err => {
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
