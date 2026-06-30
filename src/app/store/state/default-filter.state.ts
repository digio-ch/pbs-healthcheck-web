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
  private peopleTypes = new BehaviorSubject<PeopleType[]>(null);

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

  getSelectedPeopleTypeNames$(): Observable<string[]> {
    return this.peopleTypes.pipe(
      filter(peopleTypes => !!peopleTypes),
      map(peopleTypes => 
        peopleTypes
          .filter(peopleType => peopleType.selected)
          .map(peopleType => peopleType.name),
      )
    );
  }

  initializePeopleTypes() {
    this.peopleTypes.next([
      new PeopleType('members'), 
      new PeopleType('leaders')
    ]);
  }

  setPeopleTypeSelected(peopleType: PeopleType, selected: boolean) {
    const updated = this.peopleTypes.value.map(type =>
      type.name === peopleType.name
        ? { ...type, selected }
        : type
    );

    this.peopleTypes.next(updated);
  }

  setGroupTypes(types: GroupType[]) {
    this.groupTypes.next(types);
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
