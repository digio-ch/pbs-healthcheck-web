import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { GamificationService } from '../../store/services/gamification.service';
import { Subject } from 'rxjs';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-gamification-popup',
    templateUrl: './gamification-popup.component.html',
    styleUrls: ['./gamification-popup.component.scss'],
    imports: [NgIf, TranslatePipe]
})
export class GamificationPopupComponent implements OnInit, OnDestroy {
  showPopup = false;
  loading = false;
  title = '';

  private destroyed$ = new Subject();

  constructor(
    private gamificationService: GamificationService,
  ) {
  }

  ngOnInit(): void {
    this.gamificationService.checkLevel$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(checkLevel => {
        this.showPopup = !checkLevel.popupClosed;
        this.title = checkLevel.title;
    });

    this.gamificationService.loading$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(loading => {
      this.loading = loading;
    });
  }

  close(): void {
    this.gamificationService.closeCheckLevel();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
