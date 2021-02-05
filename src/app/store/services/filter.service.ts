import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {FilterData} from '../../shared/models/filter-data';
import {map} from 'rxjs/operators';
import {FilterDataAdapter} from '../../shared/adapters/filter-data.adapter';
import {Group} from '../../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private httpClient: HttpClient,
    private filterDataAdapter: FilterDataAdapter
  ) { }

  getFilterData(group: Group): Observable<FilterData> {
    return this.httpClient.get(environment.api + '/groups/' + group.id + '/filter-data')
      .pipe(map(data => this.filterDataAdapter.adapt(data)));
  }
}
