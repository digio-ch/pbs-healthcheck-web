import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { GroupFacade } from '../../store/facade/group.facade';

@Injectable({
  providedIn: 'root'
})
export class GroupsettingsService {
  private apiService = inject(ApiService);
  private groupFacade = inject(GroupFacade);


  postRoleOverviewFilter(filter: string[]) {
    return this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/general/filter`, filter)
      .subscribe();
  }
}
