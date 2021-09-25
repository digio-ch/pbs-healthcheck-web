import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Group} from '../../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupState {
  private syncableGroups = new BehaviorSubject<Group[]>(null);
  private readableGroups = new BehaviorSubject<Group[]>(null);
  private currentGroup = new BehaviorSubject<Group>(null);

  getCurrentGroup$(): Observable<Group> {
    return this.currentGroup.asObservable();
  }

  getCurrentGroup(): Group {
    return this.currentGroup.value;
  }

  setCurrentGroup(group: Group) {
    this.currentGroup.next(group);
  }

  getCurrentGroups(): Group[] {
    return this.readableGroups.value;
  }

  setSyncableGroups(groups: Group[]) {
    this.syncableGroups.next(groups);
  }

  setReadableGroups(groups: Group[]) {
    this.readableGroups.next(groups);
  }
}
