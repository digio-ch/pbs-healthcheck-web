import {BehaviorSubject, Observable} from 'rxjs';
import {Permission} from '../../shared/models/permission';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InviteState {
  private isLoading = new BehaviorSubject(false);
  private invites = new BehaviorSubject<Permission[]>([]);

  public isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  public setLoading(loading: boolean) {
    this.isLoading.next(loading);
  }

  public getInvites$(): Observable<Permission[]> {
    return this.invites.asObservable();
  }

  public setInvites(invites: Permission[]) {
    this.invites.next(invites);
  }

  public addInvite(invite: Permission) {
    const currentValues = this.invites.value;
    this.invites.next([...currentValues, invite]);
  }

  public removeInvite(invite: Permission) {
    const newValues = this.invites.value.filter(item => item.id !== invite.id);
    this.setInvites(newValues);
  }
}
