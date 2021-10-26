import {AppState} from '../state/app.state';
import {GroupFacade} from './group.facade';
import {Observable, Subscription} from 'rxjs';
import {Person} from '../../shared/models/person';
import {Injectable} from '@angular/core';
import {PersonAdapter} from '../../shared/adapters/person.adapter';
import {GroupAdapter} from '../../shared/adapters/group.adapter';
import {AuthService} from '../services/auth.service';
import {tap} from 'rxjs/operators';
import {SyncService} from '../services/sync.service';

@Injectable({
  providedIn: 'root'
})
export class AppFacade {

  constructor(
    private appState: AppState,
    private groupFacade: GroupFacade,
    private personAdapter: PersonAdapter,
    private groupAdapter: GroupAdapter,
    private authService: AuthService,
    private syncService: SyncService
  ) {
    this.initStateFromStorage();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.appState.isLoggedIn$();
  }

  isCurrentlyLoggedIn(): boolean {
    return this.appState.isCurrentlyLoggedIn();
  }

  openOAuth(action?: string, state?: string) {
    this.authService.openOAuth(action, state);
  }

  logIn(code: string): Observable<Person> {
    return this.authService.login(code).pipe(tap(
      person => {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('person', JSON.stringify(person));
        this.appState.setLoggedIn(true);
        this.appState.setPerson(person);
        if (person.readableGroups.length === 0) {
          return;
        }
        this.groupFacade.setSyncableGroups(person.syncableGroups);
        this.groupFacade.setReadableGroups(person.readableGroups);
        this.groupFacade.setCurrentGroup(person.syncableGroups.length ? person.syncableGroups[0] : person.readableGroups[0]);
      }
    ));
  }

  sync(groupId: string, code: string): Observable<void> {
    return this.syncService.sync(groupId, code);
  }

  optOut(groupId: string): Subscription {
    return this.syncService.optOut(groupId).subscribe(
      result => {},
      error => {});
  }

  logOut(): Observable<any> {
    return this.authService.logout().pipe(tap(
      res => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('person');
        sessionStorage.removeItem('group');
      }
    ));
  }

  getPerson$(): Observable<Person> {
    return this.appState.getPerson$();
  }

  private initStateFromStorage() {
    const personObj = JSON.parse(sessionStorage.getItem('person'));

    if (!personObj) {
      // session storage probably empty and user not logged in
      this.appState.setLoggedIn(false);
      return;
    }

    const person = this.personAdapter.adapt(personObj);
    this.appState.setPerson(person);
    this.appState.setLoggedIn(true);

    if (person.readableGroups.length === 0) {
      return;
    }

    const currentGroup = JSON.parse(sessionStorage.getItem('group'));
    this.groupFacade.setReadableGroups(person.readableGroups);

    const group = currentGroup ? this.groupAdapter.adapt(currentGroup) : person.readableGroups[0];
    this.groupFacade.setCurrentGroup(group);
  }
}
