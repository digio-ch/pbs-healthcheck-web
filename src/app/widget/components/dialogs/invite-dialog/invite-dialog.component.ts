import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InviteFacade} from '../../../../store/facade/invite.facade';
import {Observable} from 'rxjs';
import {Invite} from '../../../../shared/models/invite';
import {FormControl, Validators} from '@angular/forms';
import {GroupFacade} from '../../../../store/facade/group.facade';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.scss']
})
export class InviteDialogComponent implements OnInit {
  readonly EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  emailControl = new FormControl('', [Validators.pattern(this.EMAIL_REGEX), Validators.required]);
  currentGroupName: string;
  loading$: Observable<boolean>;
  invites$: Observable<Invite[]>;

  constructor(
    public dialogRef: MatDialogRef<InviteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { canEdit: boolean },
    private inviteFacade: InviteFacade,
    private groupFacade: GroupFacade
  ) { }

  ngOnInit(): void {
    this.inviteFacade.loadInvites();
    this.loading$ = this.inviteFacade.isLoading$();
    this.invites$ = this.inviteFacade.getInvites$();
    this.currentGroupName = this.groupFacade.getCurrentGroupSnapshot().name;
  }

  onDelete(invite: Invite) {
    this.inviteFacade.deleteInvite(invite);
  }

  onConfirm() {
    const invite = new Invite(null, this.emailControl.value, null);
    this.inviteFacade.createInvite(invite);
    this.emailControl.reset();
  }
}
