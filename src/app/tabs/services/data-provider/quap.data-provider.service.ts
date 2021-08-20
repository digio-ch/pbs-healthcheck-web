import { Injectable } from '@angular/core';
import {DataProviderService} from './data-provider.service';
import {QuapService} from '../../components/tabs/quap/services/quap.service';
import {GroupFacade} from '../../../store/facade/group.facade';

@Injectable({
  providedIn: 'root'
})
export class QuapDataProviderService extends DataProviderService {

  constructor(
    private quapService: QuapService,
    private groupFacade: GroupFacade,
  ) {
    super();
  }

  loadData(): Promise<any> {
    const groupId = this.groupFacade.getCurrentGroupSnapshot().id;

    const questionnairePromise = this.quapService.getQuestionnaire().toPromise();
    const answersPromise = this.quapService.getAnswers(groupId).toPromise();

    return Promise.all([questionnairePromise, answersPromise]).then(values => {
      return values;
    });
  }
}
