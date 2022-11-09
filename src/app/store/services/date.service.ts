import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from '../../shared/models/group';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {FilterDateAdapter} from '../../shared/adapters/filter-date.adapter';
import {DateModel} from '../../shared/models/date-selection/date.model';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor(
    private httpClient: HttpClient,
    private filterDateAdapter: FilterDateAdapter
  ) { }

  getFilterData(group: Group): Observable<DateModel[]> {
    return this.httpClient.get(`${environment.api}/groups/${group.id}/date-filter`)
      .pipe(map((data: any) => this.filterDateAdapter.adaptArray(data.dates)));
  }
}
