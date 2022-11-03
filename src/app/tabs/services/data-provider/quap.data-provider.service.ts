import { Injectable } from '@angular/core';
import {DataProviderService} from '../../../shared/services/data-provider.service';
import {QuapService} from '../../../apps/quap/services/quap.service';
import {DateSelection} from '../../../shared/models/date-selection/date-selection';
import {Group} from '../../../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class QuapDataProviderService extends DataProviderService {

  constructor(
    private quapService: QuapService,
  ) {
    super();
  }

  refreshData(dateSelection: DateSelection, group: Group, peopleTypes: string[], groupTypes: string[]): Promise<boolean> {
    const questionnairePromise = this.quapService.getQuestionnaire(dateSelection).toPromise();
    const answersPromise = this.quapService.getAnswers(dateSelection, group.id).toPromise();

    return Promise.all([questionnairePromise, answersPromise]).then(values => {
      this.setData(values);
      return true;
    }).catch(error => {
      return false;
    });
  }
}
