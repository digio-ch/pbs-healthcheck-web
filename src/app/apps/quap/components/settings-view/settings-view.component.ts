import {Component, Input, OnInit} from '@angular/core';
import {DialogController, DialogService} from '../../../../shared/services/dialog.service';
import {QuapSettings, QuapSettingsService} from '../../services/quap-settings.service';
import {ApiService} from '../../../../shared/services/api.service';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {Group} from '../../../../shared/models/group';
import {PopupService, PopupType} from '../../../../shared/services/popup.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {GroupType} from '../../../../shared/models/group-type';
import {GamificationService} from '../../../../store/services/gamification.service';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit, DialogController {
  @Input() disableGroupToggles = false;

  settings: QuapSettings;
  wasModified = false;

  protected readonly GroupType = GroupType;

  constructor(
    private dialogService: DialogService,
    private quapSettingsService: QuapSettingsService,
    private groupFacade: GroupFacade,
    private apiService: ApiService,
    private popupService: PopupService,
    private gamificationService: GamificationService,
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

    this.gamificationService.fetchCheckLevel();
  }

  isShareable$(): Observable<boolean> {
    return this.groupFacade.getCurrentGroup$().pipe(
      map(group => {
        const isCanton = GroupType.CANTONAL_KEY === group.groupType.groupType;
        const isOwner = group.permissionType === Group.PERMISSION_TYPE_OWNER;
        return !isCanton && isOwner && !this.disableGroupToggles;
      })
    );
  }

  isGroupType$(type: string): Observable<boolean> {
    return this.groupFacade.getCurrentGroup$().pipe(
      map(group => type === group.groupType.groupType)
    );
  }

  afterClosed(result: any): void {
  }

  beforeClosed(result: any): void {
  }
}
