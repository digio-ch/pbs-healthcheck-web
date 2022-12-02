import {Component, Input, OnInit} from '@angular/core';
import {DialogController, DialogService} from '../../../../shared/services/dialog.service';
import {QuapSettings, QuapSettingsService} from '../../services/quap-settings.service';
import {ApiService} from '../../../../shared/services/api.service';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {Group} from '../../../../shared/models/group';
import {PopupService, PopupType} from '../../../../shared/services/popup.service';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit, DialogController {
  @Input() disableGroupToggles = false;

  settings: QuapSettings;
  wasModified: boolean = false;

  constructor(
    private dialogService: DialogService,
    private quapSettingsService: QuapSettingsService,
    private groupFacade: GroupFacade,
    private apiService: ApiService,
    private popupService: PopupService,
  ) { }

  get canton(): string {
    return this.groupFacade.getCurrentGroupSnapshot().cantonName;
  }

  ngOnInit(): void {
    this.dialogService.addDialogController(this);
    this.settings = JSON.parse(JSON.stringify(this.quapSettingsService.getSettingsSnapshot()));
  }

  updateShowNotRelevant(value: boolean): void {
    this.wasModified = true;
    this.settings.showNotRelevant = value;
  }

  updateShareData(value: boolean): void {
    this.wasModified = true;
    this.settings.shareData = value;
  }

  close(): void {
    this.dialogService.close().then();
  }

  onCloseRequest(): Promise<boolean> {
    if (!this.wasModified){
      return Promise.resolve(true);
    }

    return this.popupService.open({
      title: 'dialog.quap.unsaved_changes.title',
      message: 'dialog.quap.unsaved_changes.message',
      cancel: 'dialog.quap.unsaved_changes.cancel',
      submit: 'dialog.quap.unsaved_changes.submit',
      type: PopupType.WARNING,
    });
  }

  save(): void {
    this.quapSettingsService.setSettings(this.settings);
    this.apiService.patch(`groups/${(this.groupFacade.getCurrentGroupSnapshot().id)}/app/quap/questionnaire`, {
      allow_access: this.settings.shareData,
    }).subscribe();
    this.dialogService.forceClose();
  }

  isOwner(): boolean {
    return this.groupFacade.getCurrentGroupSnapshot().permissionType === Group.PERMISSION_TYPE_OWNER;
  }

  afterClosed(result: any): void {
  }

  beforeClosed(result: any): void {
  }

}
