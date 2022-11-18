import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogController, DialogService} from '../../services/dialog.service';
import {UntypedFormControl, Validators} from '@angular/forms';
import {InviteFacade} from '../../../store/facade/invite.facade';
import {Permission} from '../../models/permission';
import {Observable, Subject} from 'rxjs';
import {subscribeOn, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-permission-view',
  templateUrl: './permission-view.component.html',
  styleUrls: ['./permission-view.component.scss']
})
export class PermissionViewComponent implements OnInit, OnDestroy, DialogController {

  displayedColumns = ['email', 'permission', 'expiration', 'actions'];

  readonly EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  emailFormControl = new UntypedFormControl('', [Validators.pattern(this.EMAIL_REGEX), Validators.required]);
  permissionFormControl = new UntypedFormControl('', [Validators.required]);

  permissions: Permission[];
  loading: boolean;

  private destroyed$ = new Subject();

  constructor(
    private dialogService: DialogService,
    private inviteFacade: InviteFacade,
  ) { }

  get formValid(): boolean {
    return this.emailFormControl.valid && this.permissionFormControl.valid;
  }

  ngOnInit(): void {
    this.dialogService.addDialogController(this);

    this.inviteFacade.loadInvites();
    this.inviteFacade.isLoading$().pipe(
      takeUntil(this.destroyed$),
      tap(loading => this.loading = loading),
    ).subscribe();
    this.inviteFacade.getInvites$().pipe(
      takeUntil(this.destroyed$),
      tap(permissions => this.permissions = permissions),
    ).subscribe();
  }

  close(): void {
    this.dialogService.close();
  }

  delete(permission: Permission): void {
    this.inviteFacade.deleteInvite(permission);
  }

  submit(): void {
    if (!this.formValid) {
      return;
    }

    const permission = new Permission(null, this.emailFormControl.value, this.permissionFormControl.value, null);
    this.inviteFacade.createInvite(permission);

    this.emailFormControl.reset();
    this.permissionFormControl.reset();
  }

  afterClosed(result: any): void {
  }

  beforeClosed(result: any): void {
  }

  onCloseRequest(): Promise<boolean> {
    return Promise.resolve(true);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
