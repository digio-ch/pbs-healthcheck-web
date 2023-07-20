import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AppModel} from '../../../models/app.model';
import {takeUntil} from 'rxjs/operators';
import {AppsFacade} from '../../store/facade/apps.facade';
import {Router} from '@angular/router';
import {GroupFacade} from '../../../store/facade/group.facade';

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
    protected groupFacade: GroupFacade,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.appsFacade.getApps$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(apps => this.apps = apps.filter(app => !app.requiredPermission ||
      app.requiredPermission.find(key => key === this.groupFacade.getCurrentGroupSnapshot().permissionType)));
  }

  goTo(app: AppModel): void {
    this.router.navigate(['app', app.path]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
