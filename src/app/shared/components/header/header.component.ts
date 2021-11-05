import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Group} from '../../models/group';
import {Person} from '../../models/person';
import {GroupContextChangeComponent} from '../../../widget/components/dialogs/group-context-change/group-context-change.component';
import {InviteDialogComponent} from '../../../widget/components/dialogs/invite-dialog/invite-dialog.component';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AppFacade} from '../../../store/facade/app.facade';
import {GroupFacade} from '../../../store/facade/group.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentGroup: Group;
  person: Person;
  loggedIn$: Observable<boolean>;

  subscriptions: Subscription[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    private appFacade: AppFacade,
    private groupFacade: GroupFacade,
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
    return this.person.hasRoleInGroup(this.currentGroup.id, [
      'Group::Abteilung::Coach',
      'Group::Abteilung::Abteilungsleitung',
      'Group::Abteilung::AbteilungsleitungStv'
    ]);
  }

  openGroupContextDialog() {
    const dialogRef = this.dialog.open(GroupContextChangeComponent);
  }

  openInviteDialog() {
    const dialogRef = this.dialog.open(InviteDialogComponent, {
      minWidth: '364px',
      data: {
        canEdit: this.person.hasRoleInGroup(this.currentGroup.id, [
          'Group::Abteilung::Abteilungsleitung',
          'Group::Abteilung::AbteilungsleitungStv'
        ])
      }
    });
  }

  logout() {
    this.appFacade.logOut().subscribe(result => {
      this.router.navigate(['login']);
    });
  }

  onMouseEnter() {
    document.getElementById('robot').style.top = '32px';
  }

  onMouseLeave() {
    document.getElementById('robot').style.top = '2px';
  }

  onLogoClick() {
    document.getElementById('robot').style.top = '28px';
    setTimeout(() => {
      document.getElementById('robot').style.top = '2px';
    }, 5000);
  }

}
