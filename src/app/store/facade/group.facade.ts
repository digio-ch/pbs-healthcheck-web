import {Injectable} from '@angular/core';
import {GroupState} from '../state/group.state';
import {GroupService} from '../services/group.service';
import {Group} from '../../shared/models/group';
import {Observable} from 'rxjs';
import {FilterFacade} from './filter.facade';

@Injectable({
  providedIn: 'root'
})
export class GroupFacade {
  constructor(
    private groupState: GroupState,
    private groupService: GroupService,
    private filterFacade: FilterFacade
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
    // clear filter state and reload since context changed
    this.filterFacade.loadFilterData(group);
  }

  public getCurrentGroup$(): Observable<Group> {
    return this.groupState.getCurrentGroup$();
  }

  public getCurrentGroupSnapshot(): Group {
    return this.groupState.getCurrentGroup();
  }
}
