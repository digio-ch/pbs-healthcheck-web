import {Injectable} from '@angular/core';
import {GroupState} from '../state/group.state';
import {Group} from '../../shared/models/group';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupFacade {
  constructor(
    private groupState: GroupState,
  ) { }

  public getGroupsSnapshot(): Group[] {
    return this.groupState.getCurrentGroups();
  }

  public setGroups(groups: Group[]) {
    this.groupState.setGroups(groups);
  }

  public setCurrentGroup(group: Group) {
    this.groupState.setCurrentGroup(group);
    sessionStorage.setItem('group', JSON.stringify(group));
  }

  public getCurrentGroup$(): Observable<Group> {
    return this.groupState.getCurrentGroup$();
  }

  public getCurrentGroupSnapshot(): Group {
    return this.groupState.getCurrentGroup();
  }
}
