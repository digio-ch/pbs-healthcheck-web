import {DataProviderService} from '../../../shared/services/data-provider.service';
import {Group} from '../../../shared/models/group';
import {DateSelection} from '../../../shared/models/date-selection/date-selection';
import {QuapService} from '../../../apps/quap/services/quap.service';
import {Injectable} from '@angular/core';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuapOverviewDataProviderService extends DataProviderService {
  constructor(
    private quapService: QuapService,
  ) {
    super();
  }

  refreshData(dateSelection: DateSelection, group: Group, peopleTypes: string[], groupTypes: string[]): Promise<boolean> {
    return this.quapService.getSubdepartmentAnswers(dateSelection, group.id).pipe(
      tap(data => {
        this.setData(data);
      }),
      map(() => true),
    ).toPromise();
  }
}
