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
  }

  public logCardLayer(){
    this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/card-layer`, {})
      .subscribe();
  }

  public logFilterChanges(){
    let loggedTime = false;
    let loggedData = false;
    const defaultGroupTypes = [
      'Group::Biber',
      'Group::Woelfe',
      'Group::Pfadi',
      'Group::Pio',
      'Group::AbteilungsRover'
    ];
    const defaultPeopleTypes = [
      'members',
      'leaders'
    ];

    return (e) => {
      if (!loggedTime && e.dateSelection?.isRange) {
        this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/time-filter`, {})
          .subscribe();
        loggedTime = true;
      }
      if (!loggedData &&
        ((JSON.stringify(e.groupTypes) !== JSON.stringify(defaultGroupTypes) && e.groupTypes.length !== 0) ||
          JSON.stringify(e.peopleTypes) !== JSON.stringify(defaultPeopleTypes))) {
        this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/data-filter`, {})
          .subscribe();
        loggedData = true;
      }
    };
  }
}
