import { Component, Input, OnInit, inject } from '@angular/core';
import { LeaderOverviewGroup } from '../../../../../../shared/models/leader-overview/leader-overview-group';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Qualification } from '../../../../../../shared/models/leader-overview/qualification';
import { take } from 'rxjs/operators';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-leader-overview-section',
    templateUrl: './leader-overview-section.component.html',
    styleUrls: ['./leader-overview-section.component.scss'],
    imports: [NgClass, MatTooltip]
})
export class LeaderOverviewSectionComponent implements OnInit {
  private translateService = inject(TranslateService);


  @Input() group: LeaderOverviewGroup;
  validUntilMessage = '';
  validForeverMessage = '';

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
    // 'No expiration date' is a fix string sent by the api
    if (q.expiresAt === 'No expiration date') {
      return base + '\n' + this.validForeverMessage;
    }

    const date = moment(q.expiresAt);
    return base + '\n' + this.validUntilMessage + date.format('DD.MM.YYYY');
  }
}
