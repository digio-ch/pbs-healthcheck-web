import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { GroupContextChangeComponent } from '../../../apps/widget/components/dialogs/group-context-change/group-context-change.component';
import { AppFacade } from '../../../store/facade/app.facade';
import { GamificationFacade } from '../../../store/facade/gamification.facade';
import { GroupFacade } from '../../../store/facade/group.facade';
import { Group } from '../../models/group';
import { Person } from '../../models/person';
import { DialogService } from '../../services/dialog.service';
import { BreadcrumbNavigationComponent } from '../breadcrumb-navigation/breadcrumb-navigation.component';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';

import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { PermissionViewComponent } from '../permission-view/permission-view.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [BreadcrumbNavigationComponent, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatDivider, PermissionViewComponent, TranslatePipe]
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('permissionView', { static: true }) permissionView: TemplateRef<any>;

  currentGroup: Group;
  person: Person;
  loggedIn$: Observable<boolean>;

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private appFacade: AppFacade,
    private groupFacade: GroupFacade,
    private dialogService: DialogService,
    private gamificationFacade: GamificationFacade,
  ) { }

  ngOnInit(): void {
    this.loggedIn$ = this.appFacade.isLoggedIn$();
    this.subscriptions.push(this.appFacade.getPerson$().subscribe(person => {
      this.person = person;
    }));
    this.subscriptions.push(this.groupFacade.getCurrentGroup$().subscribe(group => {
      this.currentGroup = group;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  showInviteMenuAction(): boolean {
    if (!this.currentGroup) {
      return false;
    }
    return this.currentGroup.permissionType === Group.PERMISSION_TYPE_OWNER;
  }

  openGroupContextDialog() {
    this.dialog.open(GroupContextChangeComponent);
  }

  openInviteDialog() {
    this.dialogService.open(this.permissionView);
  }

  logout() {
    this.appFacade.logOut().subscribe(result => {
      this.router.navigate(['login']);
    });
  }

  openPersonGamificationProfile() {
    this.gamificationFacade.gotoProfile();
  }

  onMouseEnter() {
    document.getElementById('robot').style.top = '32px';
  }

  onMouseLeave() {
    document.getElementById('robot').style.top = '2px';
  }

  onLogoClick() {
    this.router.navigate(['dashboard'])
  }

}
