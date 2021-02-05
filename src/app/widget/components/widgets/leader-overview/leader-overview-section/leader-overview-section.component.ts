import {Component, Input, OnInit} from '@angular/core';
import {LeaderOverviewGroup} from '../../../../../shared/models/leader-overview/leader-overview-group';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {Qualification} from '../../../../../shared/models/leader-overview/qualification';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-leader-overview-section',
  templateUrl: './leader-overview-section.component.html',
  styleUrls: ['./leader-overview-section.component.scss']
})
export class LeaderOverviewSectionComponent implements OnInit {

  @Input() group: LeaderOverviewGroup;
  validUntilMessage = '';
  validForeverMessage = '';

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    this.translateService.get('chart.leader-overview.qualification.valid-until')
      .pipe(take(1))
      .subscribe(res => {
        this.validUntilMessage = res;
      });
    this.translateService.get('chart.leader-overview.qualification.valid-forever')
      .pipe(take(1))
      .subscribe(res => {
        this.validForeverMessage = res;
      });
  }

  getLabelForQualification(q: Qualification) {
    const base = q.fullName;
    const date = moment(q.expiresAt);
    if (date.isValid()) {
      return base + '\n' + this.validUntilMessage + date.format('DD.MM.YYYY');
    } else {
      return base + '\n' + this.validForeverMessage;
    }
  }

}
