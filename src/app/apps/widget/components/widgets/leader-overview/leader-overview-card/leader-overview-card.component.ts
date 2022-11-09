import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LeaderOverviewGroup} from '../../../../../../shared/models/leader-overview/leader-overview-group';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-leader-overview-card',
  templateUrl: './leader-overview-card.component.html',
  styleUrls: ['./leader-overview-card.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({
          opacity: 0,
          pointerEvents: 'none'
        }),
        animate('0.2s',
          style({
            opacity: 1,
            pointerEvents: 'none'
          }),
        )
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          pointerEvents: 'none'
        }),
        animate('0.2s',
          style({
            opacity: 0,
            pointerEvents: 'none'
          }),
        )
      ]),
    ])
  ]
})
export class LeaderOverviewCardComponent implements OnInit, OnDestroy {
  @ViewChild('leaderOverviewCard') cardElement: ElementRef;
  @ViewChild('leaderOverviewDetailCard') detailElement: ElementRef;

  @Input() leaderOverviewGroup: LeaderOverviewGroup;
  @Input() scrollOffsetX: Observable<number>;
  offsetSubscription: Subscription;
  showLeaders = false;

  constructor() { }

  ngOnInit(): void {
    this.offsetSubscription = this.scrollOffsetX.subscribe(offset => {
      this.updateDetailCardPosition();
    });
  }

  ngOnDestroy(): void {
    this.offsetSubscription.unsubscribe();
  }

  updateDetailCardPosition() {
    if (!this.detailElement) {
      return;
    }
    const cardRect = this.cardElement.nativeElement.getBoundingClientRect();
    this.detailElement.nativeElement.style.left = cardRect.x + 'px';
  }

  onLeaderOverviewDetailClick() {
    console.log('ok');
    this.showLeaders = !this.showLeaders;
    this.updateDetailCardPosition();
  }
}
