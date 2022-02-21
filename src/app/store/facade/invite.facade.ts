import {InviteService} from '../services/invite.service';
import {InviteState} from '../state/invite.state';
import {Observable} from 'rxjs';
import {Permission} from '../../shared/models/permission';
import {GroupFacade} from './group.facade';
import {take} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InviteFacade {
  constructor(
    private inviteState: InviteState,
    private inviteService: InviteService,
    private groupFacade: GroupFacade
  ) {
  }

  public loadInvites() {
    this.inviteState.setLoading(true);
    this.inviteService.getAllInvites(this.groupFacade.getCurrentGroupSnapshot().id)
      .pipe(take(1))
      .subscribe(
        result => this.setInvites(result),
        error => this.inviteState.setLoading(false),
        () => this.inviteState.setLoading(false)
      );
  }

  public deleteInvite(invite: Permission) {
    this.inviteState.setLoading(true);
    return this.inviteService.deleteInvite(
      this.groupFacade.getCurrentGroupSnapshot().id,
      invite.id
    ).pipe(take(1)).subscribe(
      result => this.removeInvite(invite),
      error => this.inviteState.setLoading(false),
      () => this.inviteState.setLoading(false)
    );
  }

  public createInvite(invite: Permission) {
    this.inviteState.setLoading(true);
    return this.inviteService.createInvite(
      this.groupFacade.getCurrentGroupSnapshot().id,
      invite
    ).pipe(take(1)).subscribe(
      result => this.addInvite(result),
      error => this.inviteState.setLoading(false),
      () => this.inviteState.setLoading(false)
    );
  }

  public isLoading$(): Observable<boolean> {
    return this.inviteState.isLoading$();
  }

  public getInvites$(): Observable<Permission[]> {
    return this.inviteState.getInvites$();
  }

  public setInvites(invites: Permission[]) {
    this.inviteState.setInvites(invites);
  }

  public addInvite(invite: Permission) {
    this.inviteState.addInvite(invite);
  }

  public removeInvite(invite: Permission) {
    this.inviteState.removeInvite(invite);
  }
}
