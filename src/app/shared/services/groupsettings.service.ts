import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {GroupFacade} from '../../store/facade/group.facade';

@Injectable({
  providedIn: 'root'
})
export class GroupsettingsService {
  constructor(
    private apiService: ApiService,
    private groupFacade: GroupFacade,
  ) {}

  postRoleOverviewFilter(filter: string[]) {
    return this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/general/filter`, filter)
      .subscribe();
  }
}
