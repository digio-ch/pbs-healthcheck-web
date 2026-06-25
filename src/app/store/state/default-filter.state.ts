import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { PeopleType } from '../../shared/models/people-type';
import { GroupType } from '../../shared/models/group-type';

@Injectable({
  providedIn: 'root'
})
export class DefaultFilterState {

  private loading = new BehaviorSubject(true);
  private groupTypes = new BehaviorSubject<GroupType[]>(null);
  private peopleTypes = new BehaviorSubject<PeopleType[]>([
    new PeopleType('members'), 
    new PeopleType('leaders')
  ]);

  isLoading$(): Observable<boolean> {
    return this.loading.pipe(
      distinctUntilChanged(),
    );
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

  getSelectedPeopleTypeNames$(): Observable<string[]> {
    return this.peopleTypes.pipe(
      map(peopleTypes => 
        peopleTypes
          .filter(peopleType => peopleType.selected)
          .map(peopleType => peopleType.name),
      )
    );
  }

  setGroupTypes(types: GroupType[]) {
    this.groupTypes.next(types);
  }

  setPeopleTypeSelected(peopleType: PeopleType, selected: boolean) {
    const updated = this.peopleTypes.value.map(type =>
      type.name === peopleType.name
        ? { ...type, selected }
        : type
    );

    this.peopleTypes.next(updated);
  }

  setGroupTypeSelected(groupType: GroupType, selected: boolean) {
    const updated = this.groupTypes.value.map(type =>
      type.id === groupType.id
        ? { ...type, selected }
        : type
    );

    this.groupTypes.next(updated);
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

  getSelectedGroupTypeNames$(): Observable<string[]> {
    return this.groupTypes.pipe(
      filter(groupTypes => !!groupTypes),
      map(groupTypes => 
        groupTypes
          .filter(groupType => groupType.selected)
          .map(groupType => groupType.groupType),
      ),
      distinctUntilChanged((a,b) => 
        a.length === b.length && a.every((v,i) => v === b[i])
      ),
    );
  }
}
