import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupState {
  /*
    REFACTOR TODO: correct the typing of currentGroup that it is null on initialization
  */
  private mainGroups = new BehaviorSubject<Group[]>(null);
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
    return this.mainGroups.value;
  }

  setGroups(groups: Group[]) {
    this.mainGroups.next(groups);
  }
}
