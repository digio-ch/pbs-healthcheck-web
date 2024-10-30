import { Component, OnInit } from '@angular/core';
import {GamificationFacade} from '../../store/facade/gamification.facade';
import {GamificationLevel, PersonalGamification} from '../../shared/models/gamification';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.scss']
})
export class PersonalProfileComponent implements OnInit {

  gamification: PersonalGamification;
  levelUp = false;
  loading = true;
  constructor(private gamificationFacade: GamificationFacade) { }

  ngOnInit(
  ): void {
    this.gamificationFacade.getLoading$().subscribe(loading => {
      this.loading = loading;
    });
    this.gamificationFacade.fetchData();
    this.gamificationFacade.personalGamification$.subscribe(data => {
      this.gamification = data;
      this.levelUp = data?.levelUp;
    });
  }

  closeLevelUp() {
    this.levelUp = false;
  }
  resetGamification() {
    this.gamificationFacade.resetGamification();
  }

  isLevelComplete(level: GamificationLevel) {
    return level.key <= this.gamification.levelKey;
  }
}
