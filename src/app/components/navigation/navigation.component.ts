import {Component, OnDestroy, OnInit} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {GroupContextChangeComponent} from '../../widget/components/dialogs/group-context-change/group-context-change.component';
import {Group} from '../../shared/models/group';
import {AppFacade} from '../../store/facade/app.facade';
import {Person} from '../../shared/models/person';
import {GroupFacade} from '../../store/facade/group.facade';
import {FilterFacade} from '../../store/facade/filter.facade';
import {InviteDialogComponent} from '../../widget/components/dialogs/invite-dialog/invite-dialog.component';
import {WidgetFacade} from '../../store/facade/widget.facade';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //   .pipe(
  //     map(result => result.matches),
  //     shareReplay()
  //   );
  currentGroup: Group;
  loggedIn$: Observable<boolean>;
  filtersLoading$: Observable<boolean>;
  widgetsLoading$: Observable<boolean>;
  widgetDataError$: Observable<boolean>;
  person: Person;
  latestDate = '?';
  filterDatesEmpty: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    private appFacade: AppFacade,
    private groupFacade: GroupFacade,
    private filterFacade: FilterFacade,
    private widgetFacade: WidgetFacade
  ) {}

  ngOnInit(): void {
    this.loggedIn$ = this.appFacade.isLoggedIn$();
    this.filtersLoading$ = this.filterFacade.isLoading$();
    this.widgetsLoading$ = this.widgetFacade.isLoading$();
    this.widgetDataError$ = this.widgetFacade.hasError$();
    this.subscriptions.push(this.filterFacade.getAvailableDates$().subscribe(dates => {
      if (!dates) {
        return;
      }
      if (dates.length > 0) {
        this.filterDatesEmpty = false;
        this.latestDate = dates[0].date.format('DD.MM.YYYY');
        return;
      }
      this.filterDatesEmpty = true;
      this.latestDate = '?';
    }));
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

  get version(): string {
    return environment.version;
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
