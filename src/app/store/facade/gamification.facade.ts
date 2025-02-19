import {Injectable} from '@angular/core';
import {WidgetState} from '../state/widget.state';
import {WidgetService} from '../services/widget.service';
import {map, take} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, Subject, Subscription} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Group} from '../../shared/models/group';
import {CensusFilterService, CensusFilterState} from '../services/census-filter.service';
import {GamificationService} from '../services/gamification.service';
import {ApiService} from '../../shared/services/api.service';
import {GroupFacade} from './group.facade';
import {Person} from '../../shared/models/person';
import {DefaultFilterFacade} from './default-filter.facade';
import {Router} from '@angular/router';
import {PersonalGamification} from '../../shared/models/gamification';

@Injectable({
  providedIn: 'root'
})
export class GamificationFacade {

  private personalGamification = new BehaviorSubject<PersonalGamification>(null);
  public personalGamification$: Observable<PersonalGamification> = this.personalGamification.asObservable();
  public loading = new BehaviorSubject<boolean>(true);
  private badges = new BehaviorSubject<{ imgSrc: string, name: string }[]>(null);
  public badges$: Observable<{ imgSrc: string, name: string }[]> = this.badges.asObservable();

  constructor(
    private apiService: ApiService,
    private gamificationService: GamificationService,
    private groupFacade: GroupFacade,
    private filterFacade: DefaultFilterFacade,
    private router: Router
  ) {
    this.filterFacade.getUpdates$().subscribe(this.gamificationService.logFilterChanges());
  }

  gotoProfile() {
    this.router.navigate(['gamification', 'person']);
  }

  fetchData() {
    this.loading.next(true);
    this.apiService.get(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/person`)
      .subscribe((e) => {
        this.personalGamification.next(e);
        this.loading.next(false);
        this.badges.next(this.gamificationService.getBadgeList(e));
      });
  }

  getLoading$() {
    return this.loading.asObservable();
  }

  resetGamification() {
    this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/reset`, {}).subscribe();
    this.router.navigate(['']);
  }

  requestBetaAccess() {
    const obs = this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/beta`, {})
    obs.subscribe((e) => {
        const currentState = this.personalGamification.getValue();
        currentState.betaRequested = true;
        this.personalGamification.next(currentState);
      });
    return obs;
  }
}
