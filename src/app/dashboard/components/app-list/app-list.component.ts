import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AppModel} from '../../../models/app.model';
import {takeUntil} from 'rxjs/operators';
import {AppsFacade} from '../../store/facade/apps.facade';
import {Router} from '@angular/router';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit, OnDestroy {

  apps: AppModel[];

  private destroyed$ = new Subject();

  constructor(
    private appsFacade: AppsFacade,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.appsFacade.getApps$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(apps => this.apps = apps);
  }

  goTo(app: AppModel): void {
    this.router.navigate(['app', app.path]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
