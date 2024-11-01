import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppFacade} from '../../store/facade/app.facade';
import {GamificationFacade} from '../../store/facade/gamification.facade';
import {PersonalGamification} from '../../shared/models/gamification';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-person-header',
  templateUrl: './person-header.component.html',
  styleUrls: ['./person-header.component.scss']
})
export class PersonHeaderComponent implements OnInit, OnDestroy {

  badges: string[];
  name: string;
  private destroyed$ = new Subject();

  @Input() title: string;
  constructor(private appFacade: AppFacade, private gamificationFacade: GamificationFacade) {
    this.gamificationFacade.badges$.pipe(takeUntil(this.destroyed$)).subscribe(badges => {this.badges = badges; });
  }

  ngOnInit(): void {
    this.appFacade.getPerson$().subscribe((person) => {
      this.name = person.getFullName();
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
