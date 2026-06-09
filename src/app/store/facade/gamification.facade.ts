import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { skipUntil, tap } from 'rxjs/operators';
import { PersonalGamification } from '../../shared/models/gamification/person';
import { ApiService } from '../../shared/services/api.service';
import { CensusFilterService } from '../services/census-filter.service';
import { GamificationService } from '../services/gamification.service';
import { CurrentFilterState } from './default-filter.facade';
import { GroupFacade } from './group.facade';

@Injectable({
  providedIn: 'root'
})
export class GamificationFacade {
  private apiService = inject(ApiService);
  private gamificationService = inject(GamificationService);
  private groupFacade = inject(GroupFacade);
  private censusFilterService = inject(CensusFilterService);
  private router = inject(Router);


  private personalGamification = new BehaviorSubject<PersonalGamification>(null);
  public personalGamification$: Observable<PersonalGamification> = this.personalGamification.asObservable();
  public loading = new BehaviorSubject<boolean>(true);
  private badges = new BehaviorSubject<{ imgSrc: string, name: string }[]>(null);
  public badges$: Observable<{ imgSrc: string, name: string }[]> = this.badges.asObservable();

  constructor() {
    this.censusFilterService.getUpdates$().
      pipe(skipUntil(this.censusFilterService.isInitialized$())).
      subscribe(this.gamificationService.logCensusFilterChanges());
  }

  gotoProfile() {
    this.router.navigate(['gamification', 'person']);
  }

  logDateFilterChanges(e: CurrentFilterState) {
      this.gamificationService.logDateFilterChanges(e);
  }

  logGroupAndPeopleFilterChanges(e: CurrentFilterState) {
      this.gamificationService.logGroupAndPeopleFilterChanges(e);
  }

  fetchData() {
    this.loading.next(true);
    return this.apiService.get(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/person`).pipe(
      tap((e) => {
        this.personalGamification.next(e);
        this.loading.next(false);
        this.badges.next(this.gamificationService.getBadgeList(e));
      }),
    );
  }

  getLoading$() {
    return this.loading.asObservable();
  }

  async resetGamification() {
    await this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/reset`, {})
      .toPromise();
    this.router.navigate(['']);
  }

  requestBetaAccess() {
    const obs = this.apiService.patch(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/gamification/beta`, {});
    obs.subscribe((e) => {
        const currentState = this.personalGamification.getValue();
        currentState.betaRequested = true;
        this.personalGamification.next(currentState);
      });
    return obs;
  }
}
