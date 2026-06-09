import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DialogController, DialogService } from '../../services/dialog.service';
import { UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InviteFacade } from '../../../store/facade/invite.facade';
import { Permission } from '../../models/permission';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { GroupType } from '../../models/group-type';
import { GroupFacade } from '../../../store/facade/group.facade';
import moment from 'moment';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFooterCellDef, MatFooterCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatFooterRowDef, MatFooterRow } from '@angular/material/table';
import { MatFormField, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-permission-view',
    templateUrl: './permission-view.component.html',
    styleUrls: ['./permission-view.component.scss'],
    imports: [MatIconButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFooterCellDef, MatFooterCell, MatFormField, MatInput, FormsModule, ReactiveFormsModule, MatError, MatSelect, MatOption, MatTooltip, MatButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatFooterRowDef, MatFooterRow, AsyncPipe, TranslatePipe]
})
export class PermissionViewComponent implements OnInit, OnDestroy, DialogController {
  private dialogService = inject(DialogService);
  private inviteFacade = inject(InviteFacade);
  private translateService = inject(TranslateService);
  private groupFacade = inject(GroupFacade);

  displayedColumns = ['email', 'permission', 'expiration', 'actions'];

  readonly EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  emailFormControl = new UntypedFormControl('', [Validators.pattern(this.EMAIL_REGEX), Validators.required]);
  permissionFormControl = new UntypedFormControl('', [Validators.required]);

  permissions: Permission[];
  loading: boolean;

  private destroyed$ = new Subject();
  protected readonly GroupType = GroupType;

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

  renew(permission: Permission) {
    this.inviteFacade.renewInvite(permission);
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

  getFormattedExpirationDate(p: Permission): Observable<string> {
    if (!p.expirationDate) {
      return of('-');
    }

    const daysToDate = Math.ceil((new Date(p.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    return this.translateService.stream('dialog.invite.table.expires-in', { days: daysToDate }).pipe(
      map((expiresIn) => {
        const formattedDate = p.getFormattedDate();
        return `${formattedDate} (${expiresIn})`;
      })
    );
  }

  isGroupType$(type: string): Observable<boolean> {
    return this.groupFacade.getCurrentGroup$().pipe(
      map(group => type === group.groupType.groupType)
    );
  }

  isRenewable$(p: Permission): Observable<boolean> {
    const now = new Date();
    const inThreeMonths = now.setMonth(now.getMonth() + 3);
    return of(moment(p.expirationDate).isBefore(inThreeMonths));
  }
}
