import {Component, OnDestroy, OnInit} from '@angular/core';
import {GamificationFacade} from '../../store/facade/gamification.facade';
import {GamificationLevel, PersonalGamification} from '../../shared/models/gamification';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss']
})
export class PersonalProfileComponent implements OnInit, OnDestroy {

  gamification: PersonalGamification;
  levelUp = false;
  loading = true;
  restting: boolean = false;
  private destroyed$ = new Subject();
  constructor(private gamificationFacade: GamificationFacade) { }

  ngOnInit(
  ): void {
    this.gamificationFacade.getLoading$().pipe(takeUntil(this.destroyed$)).subscribe(loading => {
      this.loading = loading;
    });
    this.gamificationFacade.fetchData();
    this.gamificationFacade.personalGamification$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.gamification = data;
      this.levelUp = data?.levelUp;
    });
  }

  closeLevelUp() {
    this.levelUp = false;
  }
  async resetGamification() {
    this.restting = true;
    await this.gamificationFacade.resetGamification();
    this.restting = false;
  }

  isLevelComplete(level: GamificationLevel) {
    return level.key <= parseInt(this.gamification.levelKey, 10);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get resetEnabled(): boolean {
    return environment.gamification.resetEnabled
  }
}
