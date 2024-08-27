import {AppState} from '../state/app.state';
import {GroupFacade} from './group.facade';
import {Observable} from 'rxjs';
import {Person} from '../../shared/models/person';
import {Injectable} from '@angular/core';
import {PersonAdapter} from '../../shared/adapters/person.adapter';
import {GroupAdapter} from '../../shared/adapters/group.adapter';
import {DefaultFilterFacade} from './default-filter.facade';
import {AuthService} from '../services/auth.service';
import {tap} from 'rxjs/operators';
import {GamificationService} from '../services/gamification.service';

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
    private gamificationService: GamificationService,
  ) {
    this.initStateFromStorage();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.appState.isLoggedIn$();
  }

  isCurrentlyLoggedIn(): boolean {
    return this.appState.isCurrentlyLoggedIn();
  }

  openOAuth() {
    this.authService.openOAuth();
  }

  logIn(code: string): Observable<Person> {
    return this.authService.login(code).pipe(tap(
      person => {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('person', JSON.stringify(person));
        this.appState.setLoggedIn(true);
        this.appState.setPerson(person);
        if (person.groups.length === 0) {
          return;
        }
        this.groupFacade.setGroups(person.groups);
        this.groupFacade.setCurrentGroup(person.groups[0]);
      }
    ));
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

    if (person.groups.length === 0) {
      return;
    }

    const currentGroup = JSON.parse(sessionStorage.getItem('group'));
    this.groupFacade.setGroups(person.groups);

    const group = currentGroup ? this.groupAdapter.adapt(currentGroup) : person.groups[0];
    this.groupFacade.setCurrentGroup(group);
  }
}
