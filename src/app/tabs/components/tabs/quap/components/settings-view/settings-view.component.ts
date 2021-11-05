import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../../../../../../shared/services/dialog.service';
import {QuapSettings, QuapSettingsService} from '../../services/quap-settings.service';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {
  settings: QuapSettings;

  constructor(
    private dialogService: DialogService,
    private quapSettingsService: QuapSettingsService,
  ) { }

  ngOnInit(): void {
    this.settings = JSON.parse(JSON.stringify(this.quapSettingsService.getSettingsSnapshot()));
  }

  updateShowNotRelevant(value: boolean): void {
    this.settings.showNotRelevant = value;
  }

  close(): void {
    this.quapSettingsService.setSettings(this.settings);

    this.dialogService.close();
  }

}
