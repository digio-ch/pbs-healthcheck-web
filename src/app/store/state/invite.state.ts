import { BehaviorSubject, Observable } from 'rxjs';
import { Permission } from '../../shared/models/permission';
import { Injectable } from '@angular/core';

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
    const sortedInvites = [...this.invites.value, invite].sort((a, b) =>
      a.email.toLowerCase() < b.email.toLowerCase() ? -1 : a.email.toLowerCase() > b.email.toLowerCase() ? 1 : 0
    );

    this.invites.next(sortedInvites);
  }

  public updateInvite(i: Permission) {
    const updatedInvites = this.invites.getValue().map((invite: Permission) => i.id === invite.id ? i : invite);

    this.invites.next(updatedInvites);
  }

  public removeInvite(invite: Permission) {
    const newValues = this.invites.value.filter(item => item.id !== invite.id);
    this.setInvites(newValues);
  }
}
