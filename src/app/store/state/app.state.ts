import {BehaviorSubject, Observable} from 'rxjs';
import {Person} from '../../shared/models/person';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppState {

  private person = new BehaviorSubject<Person>(null);
  private loggedIn = new BehaviorSubject<boolean>(null);

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  isCurrentlyLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  setLoggedIn(loggedIn: boolean) {
    this.loggedIn.next(loggedIn);
  }

  getPerson$(): Observable<Person> {
    return this.person.asObservable();
  }

  setPerson(person: Person) {
    this.person.next(person);
  }
}
