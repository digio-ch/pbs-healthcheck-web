import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../../../../shared/services/dialog.service';
import {QuapSettings, QuapSettingsService} from '../../services/quap-settings.service';
import {ApiService} from '../../../../shared/services/api.service';
import {GroupFacade} from '../../../../store/facade/group.facade';
import {Group} from '../../../../shared/models/group';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {
  @Input() disableGroupToggles = false;

  settings: QuapSettings;

  constructor(
    private dialogService: DialogService,
    private quapSettingsService: QuapSettingsService,
    private groupFacade: GroupFacade,
    private apiService: ApiService,
  ) { }

  get canton(): string {
    return this.groupFacade.getCurrentGroupSnapshot().cantonName;
  }

  ngOnInit(): void {
    this.settings = JSON.parse(JSON.stringify(this.quapSettingsService.getSettingsSnapshot()));
  }

  updateShowNotRelevant(value: boolean): void {
    this.settings.showNotRelevant = value;
  }

  updateShareData(value: boolean): void {
    this.settings.shareData = value;

    this.apiService.patch(`groups/${(this.groupFacade.getCurrentGroupSnapshot().id)}/quap/questionnaire`, {
      allow_access: value,
    }).subscribe();
  }

  close(): void {
    this.quapSettingsService.setSettings(this.settings);

    this.dialogService.close();
  }

  isOwner(): boolean {
    return this.groupFacade.getCurrentGroupSnapshot().permissionType === Group.PERMISSION_TYPE_OWNER;
  }

}
