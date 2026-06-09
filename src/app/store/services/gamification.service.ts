import { Injectable } from '@angular/core';
import { GroupFacade } from '../facade/group.facade';
import { ApiService } from '../../shared/services/api.service';
import { PersonalGamification } from '../../shared/models/gamification/person';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CurrentFilterState } from '../facade/default-filter.facade';
import { CensusFilterState } from './census-filter.service';
import { CheckLevel } from '../../shared/models/gamification/check-level';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private loggedDateChange = false;
  private loggedDataChange = false;

  private checkLevel = new BehaviorSubject<CheckLevel>({levelUp: false, title: '', popupClosed: true});
  public checkLevel$ = this.checkLevel.asObservable();
  public loading = new BehaviorSubject<boolean>(true);
  public loading$ = this.loading.asObservable();

  private readonly defaultGroupTypes = [
    'Group::Biber',
    'Group::Woelfe',
    'Group::Pfadi',
    'Group::Pio',
    'Group::AbteilungsRover'
  ];
  private readonly defaultPeopleTypes = [
    'members',
    'leaders'
  ];

  constructor(
    private apiService: ApiService,
    private groupFacade: GroupFacade,
  ) {
  }

  public logGroupChange(group) {
    this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/group-change`, {group: group.id})
      .subscribe();
  }

  public logCardLayer() {
    this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/card-layer`, {})
      .subscribe();

    this.fetchCheckLevel();
  }

  public logGroupAndPeopleFilterChanges(e: CurrentFilterState) {
    if (!this.loggedDataChange &&
      ((JSON.stringify(e.groupTypes) !== JSON.stringify(this.defaultGroupTypes) && e.groupTypes.length !== 0) ||
        JSON.stringify(e.peopleTypes) !== JSON.stringify(this.defaultPeopleTypes))) {
      this.logDataFilterChange();
      this.loggedDataChange = true;
    }
  }

  public logDateFilterChanges(e: CurrentFilterState) {
    if (!this.loggedDateChange && e.dateSelection?.isRange) {
      this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/time-filter`, {})
        .subscribe();
      this.loggedDateChange = true;
    }

    this.fetchCheckLevel();
  }

  public logCensusFilterChanges() {
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

  private logDataFilterChange(): Subscription {
    const res = this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/data-filter`, {})
      .subscribe();

    this.fetchCheckLevel();

    return res;
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

  public fetchCheckLevel() {
    this.loading.next(true);
    return this.apiService.get(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/check-level`, {})
      .subscribe((checkLevel) => {
        this.loading.next(false);
        if (checkLevel.levelUp) {
          checkLevel.popupClosed = false;
        } else {
          checkLevel.popupClosed = this.checkLevel.getValue().popupClosed;
        }

        this.checkLevel.next(checkLevel);
      });
  }

  public closeCheckLevel() {
    this.checkLevel.next(
      {
        levelUp: false,
        title: this.checkLevel.getValue().title,
        popupClosed: true,
      },
    );
  }
}
