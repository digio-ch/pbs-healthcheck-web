import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PeopleType} from '../../shared/models/people-type';
import {GroupType} from '../../shared/models/group-type';

@Injectable({
  providedIn: 'root'
})
export class FilterState {

  private loading = new BehaviorSubject(false);
  private groupTypes = new BehaviorSubject<GroupType[]>(null);
  private peopleTypes = new BehaviorSubject<PeopleType[]>([
    new PeopleType('members'), new PeopleType('leaders')
  ]);

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
