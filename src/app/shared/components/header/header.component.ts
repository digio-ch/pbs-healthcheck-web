import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Group} from '../../models/group';
import {Person} from '../../models/person';
import {GroupContextChangeComponent} from '../../../widget/components/dialogs/group-context-change/group-context-change.component';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AppFacade} from '../../../store/facade/app.facade';
import {GroupFacade} from '../../../store/facade/group.facade';
import {DialogService} from '../../services/dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('permissionView', { static: true }) permissionView: TemplateRef<any>;

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
    private dialogService: DialogService,
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
    const dialogRef = this.dialog.open(GroupContextChangeComponent);
  }

  openInviteDialog() {
    this.dialogService.open(this.permissionView);
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
