import {BehaviorSubject, Observable} from 'rxjs';
import {Invite} from '../../shared/models/invite';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InviteState {
  private isLoading = new BehaviorSubject(false);
  private invites = new BehaviorSubject<Invite[]>([]);

  public isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  public setLoading(loading: boolean) {
    this.isLoading.next(loading);
  }

  public getInvites$(): Observable<Invite[]> {
    return this.invites.asObservable();
  }

  public setInvites(invites: Invite[]) {
    this.invites.next(invites);
  }

  public addInvite(invite: Invite) {
    const currentValues = this.invites.value;
    this.invites.next([...currentValues, invite]);
  }

  public removeInvite(invite: Invite) {
    const newValues = this.invites.value.filter(item => item.id !== invite.id);
    this.setInvites(newValues);
  }
}
