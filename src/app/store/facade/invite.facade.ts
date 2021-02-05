import {InviteService} from '../services/invite.service';
import {InviteState} from '../state/invite.state';
import {Observable} from 'rxjs';
import {Invite} from '../../shared/models/invite';
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

  public deleteInvite(invite: Invite) {
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

  public createInvite(invite: Invite) {
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

  public getInvites$(): Observable<Invite[]> {
    return this.inviteState.getInvites$();
  }

  public setInvites(invites: Invite[]) {
    this.inviteState.setInvites(invites);
  }

  public addInvite(invite: Invite) {
    this.inviteState.addInvite(invite);
  }

  public removeInvite(invite: Invite) {
    this.inviteState.removeInvite(invite);
  }
}
