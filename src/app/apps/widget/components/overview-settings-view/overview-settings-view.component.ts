import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { DialogController, DialogService } from 'src/app/shared/services/dialog.service';
import { PopupService, PopupType } from 'src/app/shared/services/popup.service';
import { SwitchComponent } from '../../../../shared/components/switch/switch.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-overview-settings-view',
    templateUrl: './overview-settings-view.component.html',
    styleUrls: ['./overview-settings-view.component.scss'],
    imports: [SwitchComponent, MatIconButton, MatIcon, TranslatePipe]
})
export class OverviewSettingsViewComponent implements OnInit,DialogController {
  private dialogService = inject(DialogService);
  private popupService = inject(PopupService);


  /**
   * Represents the initial state
   */
  private _sharing: boolean;

  @Input()
  get sharing(): boolean {
    return this._sharing;
  }
  set sharing(value: boolean) {
    this._sharing = value;

    // update internal state whenever input changes
    this.sharingInternal = value;
  }

@Output() shareChange = new EventEmitter<boolean>();
@Input() editable: boolean;

  /**
   * Represents the internal state of initialShare that is changed while the dialog is open
   */
  sharingInternal: boolean;
  ngOnInit(): void {
    this.dialogService.addDialogController(this);
  }

  close(): void {
    this.dialogService.close().then();
  }

  save(): void {
    if (this.editable && this.isDirty()) {
      this.shareChange.emit(this.sharingInternal);
    }

    this.dialogService.forceClose();
  }

  private isDirty(): boolean {
    return this.sharingInternal !== this.sharing;
  }

  onCloseRequest(): Promise<boolean> {
    if (!this.editable || !this.isDirty()){
      return Promise.resolve(true);
    }

    return this.popupService.open({
      title: 'dialog.overview.unsaved_changes.title',
      message: 'dialog.overview.unsaved_changes.message',
      cancel: 'dialog.overview.unsaved_changes.cancel',
      submit: 'dialog.overview.unsaved_changes.submit',
      type: PopupType.WARNING,
    });
  }

  beforeClosed(_: any): void {
  }
  afterClosed(_: any): void {
  }
}
