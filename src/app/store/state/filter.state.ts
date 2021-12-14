import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PeopleType} from '../../shared/models/people-type';
import {GroupType} from '../../shared/models/group-type';
import {FilterDate} from '../../shared/models/date-selection/filter-date';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {DateQuickSelectionOptions} from '../../shared/models/date-selection/date-quick-selection-options';

@Injectable({
  providedIn: 'root'
})
export class FilterState {

  private loading = new BehaviorSubject(false);
  private groupTypes = new BehaviorSubject<GroupType[]>(null);
  private peopleTypes = new BehaviorSubject<PeopleType[]>([
    new PeopleType('members'), new PeopleType('leaders')
  ]);
  private availableDates = new BehaviorSubject<FilterDate[]>(null);
  private dateSelection = new BehaviorSubject<DateSelection>(null);
  private dateQuickSelectionOptions = new BehaviorSubject<DateQuickSelectionOptions>(null);

  isLoading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }

  getPeopleTypes$(): Observable<PeopleType[]> {
    return this.peopleTypes.asObservable();
  }

  getPeopleTypesStrings(): string[] {
    const peopleTypesStrings = [];
    this.peopleTypes.value.forEach(item => {
      if (item.selected) { peopleTypesStrings.push(item.name); }
    });
    return peopleTypesStrings;
  }

  setDateSelection(selection: DateSelection) {
    this.dateSelection.next(selection);
  }

  getDateSelection$(): Observable<DateSelection> {
    return this.dateSelection.asObservable();
  }

  getDateSelectionSnapshot(): DateSelection {
    return this.dateSelection.value;
  }

  getDateQuickSelectionOptions$(): Observable<DateQuickSelectionOptions> {
    return this.dateQuickSelectionOptions.asObservable();
  }

  getDateQuickSelectionOptionsSnapshot(): DateQuickSelectionOptions {
    return this.dateQuickSelectionOptions.value;
  }

  getAvailableDates$(): Observable<FilterDate[]> {
    return this.availableDates.asObservable();
  }

  getAvailableDatesSnapshot(): FilterDate[] {
    return this.availableDates.value;
  }

  setAvailableDates(dates: FilterDate[]) {
    this.availableDates.next(dates);
    this.dateQuickSelectionOptions.next(new DateQuickSelectionOptions(dates));
  }

  setGroupTypes(types: GroupType[]) {
    this.groupTypes.next(types);
  }

  getGroupTypes$(): Observable<GroupType[]> {
    return this.groupTypes.asObservable();
  }

  getGroupTypesStrings(): string[] {
    if (!this.groupTypes.value) {
      return [];
    }
    const groupTypeStrings = [];
    this.groupTypes.value.forEach(item => {
      if (item.selected) { groupTypeStrings.push(item.groupType); }
    });
    return groupTypeStrings;
  }
}
