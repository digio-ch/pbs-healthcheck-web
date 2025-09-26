import { Injectable } from '@angular/core';
import {GroupFacade} from '../facade/group.facade';
import {ApiService} from '../../shared/services/api.service';
import {PersonalGamification} from '../../shared/models/gamification';
import { Subscription } from 'rxjs';
import { CurrentFilterState } from '../facade/default-filter.facade';
import { CensusFilterState } from './census-filter.service';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private loggedDateChange = false;

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

  public logGroupAndPeopleFilterChanges(){
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

    return (e: CurrentFilterState) => {
      if (!loggedData &&
        ((JSON.stringify(e.groupTypes) !== JSON.stringify(defaultGroupTypes) && e.groupTypes.length !== 0) ||
          JSON.stringify(e.peopleTypes) !== JSON.stringify(defaultPeopleTypes))) {
        this.logDataFilterChange();
        loggedData = true;
      }
    };
  }

  public logDateFilterChanges(e: CurrentFilterState) {
    if (!this.loggedDateChange && e.dateSelection?.isRange) {
      this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/time-filter`, {})
        .subscribe();
      this.loggedDateChange = true;
    }
  }

  public logCensusFilterChanges(){
    let loggedData = false;

    return (e: CensusFilterState) => {
      const groupTypes = e.roles.filter(role => role.selected).map(role => role.value);
      if (!loggedData && 
        ((groupTypes.length > 0 && groupTypes.length < 7) || 
        e.filterMales !== e.filterFemales
      )) {
        this.logDataFilterChange();
        loggedData = true;
      }
    };
  }

  private logDataFilterChange(): Subscription{
    return this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/data-filter`, {})
          .subscribe();
  }

  public getBadgeList(person: PersonalGamification): { imgSrc: string, name: string }[] {
      return person.levels.reduce((acc, level) => {
        const goalsStatus = level.goals.reduce((goalAcc, goal) => {
          if (goal.completed) {
            goalAcc.push({imgSrc: goal.key, name: goal.title});
          }
          return goalAcc;
        }, []);
        return acc.concat(goalsStatus);
      }, []);
  }
}
