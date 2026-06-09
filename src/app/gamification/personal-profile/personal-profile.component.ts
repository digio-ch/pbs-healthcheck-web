import { Component, OnDestroy, OnInit } from '@angular/core';
import { GamificationFacade } from '../../store/facade/gamification.facade';
import { GamificationLevel, PersonalGamification } from '../../shared/models/gamification/person';
import { merge, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PersonHeaderComponent } from '../person-header/person-header.component';
import { LevelCardComponent } from '../level-card/level-card.component';
import { InfoComponent } from '../../shared/components/info/info.component';

@Component({
    selector: 'app-personal-profile',
    templateUrl: './personal-profile.component.html',
    styleUrls: ['./personal-profile.component.scss'],
    imports: [LoadingComponent, PersonHeaderComponent, LevelCardComponent, InfoComponent]
})
export class PersonalProfileComponent implements OnInit, OnDestroy {

  gamification: PersonalGamification;
  loading = true;
  resetting = false;
  private destroyed$ = new Subject();
  constructor(
    private gamificationFacade: GamificationFacade,
    private translateService: TranslateService,
  ) { }

  ngOnInit(
  ): void {
    this.gamificationFacade.getLoading$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(loading => {
      this.loading = loading;
    });

    merge(
      of(null), // trigger if the page is loaded after the initial onLangChange
      this.translateService.onLangChange,
    ).pipe(
      takeUntil(this.destroyed$),
      switchMap(() => this.gamificationFacade.fetchData()),
    ).subscribe();

    this.gamificationFacade.personalGamification$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(data => {
      this.gamification = data;
    });
  }

  async resetGamification() {
    this.resetting = true;
    await this.gamificationFacade.resetGamification();
    this.resetting = false;
  }

  isLevelComplete(level: GamificationLevel) {
    return level.key <= parseInt(this.gamification.levelKey, 10);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get resetEnabled(): boolean {
    return environment.gamification.resetEnabled;
  }
}
