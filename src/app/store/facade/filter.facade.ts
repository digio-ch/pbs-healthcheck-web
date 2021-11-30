import {Injectable} from '@angular/core';
import {FilterState} from '../state/filter.state';
import {FilterService} from '../services/filter.service';
import {map, take} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {PeopleType} from '../../shared/models/people-type';
import {GroupType} from '../../shared/models/group-type';
import {FilterDate} from '../../shared/models/date-selection/filter-date';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {DateQuickSelectionOptions} from '../../shared/models/date-selection/date-quick-selection-options';
import {Group} from '../../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class FilterFacade {
  forcedUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private filterState: FilterState,
    private filterService: FilterService,
  ) {}

  isLoading$(): Observable<boolean> {
    return this.filterState.isLoading$();
  }

  loadFilterData(group: Group) {
    this.filterState.setLoading(true);
    this.filterService.getFilterData(group).pipe(take(1)).subscribe(
      filterData => {
        if (filterData.dates.length === 0) {
          return;
        }
        this.filterState.setAvailableDates(filterData.dates);
        this.filterState.setGroupTypes(filterData.groupTypes);
        // set date to today as default
        this.filterState.setDateSelection(new DateSelection(
          filterData.dates[0].date,
          null,
          false
        ));
      },
      error => console.log(error),
      () => this.filterState.setLoading(false)
    );
  }

  setDateSelection(dateSelection: DateSelection) {
      setTimeout(() => this.filterState.setDateSelection(dateSelection));
  }

  getDateSelectionSnapshot(): DateSelection {
    return this.filterState.getDateSelectionSnapshot();
  }

  isTodaySelected(): boolean {
    const dateSelection = this.getDateSelectionSnapshot();
    if (dateSelection.isRange) {
      return false;
    }
    return dateSelection.startDate === this.filterState.getAvailableDatesSnapshot()[0].date;
  }

  getDateSelection$(): Observable<DateSelection> {
    return this.filterState.getDateSelection$();
  }

  getAvailableDates$(): Observable<FilterDate[]> {
    return this.filterState.getAvailableDates$();
  }

  getAvailableDateQuickSelectionOptions$(): Observable<DateQuickSelectionOptions> {
    return this.filterState.getDateQuickSelectionOptions$();
  }

  getAvailableDateQuickSelectionOptionsSnapshot(): DateQuickSelectionOptions {
    return this.filterState.getDateQuickSelectionOptionsSnapshot();
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
}

export interface CurrentFilterState {
  dateSelection: DateSelection;
  peopleTypes: string[];
  groupTypes: string[];
}
