import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GamificationFacade} from '../../store/facade/gamification.facade';
import {PersonalGamification} from '../../shared/models/gamification';
import {take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-beta-access',
  templateUrl: './beta-access.component.html',
  styleUrls: ['./beta-access.component.scss']
})
export class BetaAccessComponent implements OnInit, OnDestroy {

  personalGamification: PersonalGamification;
  betaRequested = true;
  eligible = false;
  openPopup = false;
  loading = false;
  private destroyed$ = new Subject();
  constructor(
    private gamificationFacade: GamificationFacade
  ) {}

  ngOnInit(): void {
    this.gamificationFacade.personalGamification$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.personalGamification = data;
      this.betaRequested = data.betaRequested;
      this.eligible = data.levelKey === '3';
    });
  }

  open(): void {
    this.openPopup = true;
  }

  close(): void {
    this.openPopup = false;
  }

  request(): void {
    this.loading = true;
    const obs = this.gamificationFacade.requestBetaAccess();
    obs.subscribe((e) =>  {
      this.loading = false;
    });
  }

  preventPropagation(e: Event): void {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
