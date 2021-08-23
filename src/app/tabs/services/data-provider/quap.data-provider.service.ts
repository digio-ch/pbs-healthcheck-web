import { Injectable } from '@angular/core';
import {DataProviderService} from '../../../shared/services/data-provider.service';
import {QuapService} from '../../components/tabs/quap/services/quap.service';
import {GroupFacade} from '../../../store/facade/group.facade';
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
    const questionnairePromise = this.quapService.getQuestionnaire().toPromise();
    const answersPromise = this.quapService.getAnswers(group.id).toPromise();

    return Promise.all([questionnairePromise, answersPromise]).then(values => {
      this.setData(values);
      return true;
    }).catch(error => {
      return false;
    });
  }
}
