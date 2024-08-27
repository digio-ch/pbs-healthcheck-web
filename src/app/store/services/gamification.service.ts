import { Injectable } from '@angular/core';
import {GroupFacade} from '../facade/group.facade';
import {ApiService} from '../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {

  constructor(
    private apiService: ApiService,
    private groupFacade: GroupFacade
  ) {
  }

  public logGroupChange(group){
    this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/group-change`, {group: group.id})
      .subscribe();
    console.log(group);
  }
}
