import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FilterData } from '../../shared/models/filter-data';
import { map } from 'rxjs/operators';
import { FilterDataAdapter } from '../../shared/adapters/filter-data.adapter';
import { Group } from '../../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private httpClient = inject(HttpClient);
  private filterDataAdapter = inject(FilterDataAdapter);


  getFilterData(group: Group): Observable<FilterData> {
    return this.httpClient.get(`${environment.api}/groups/${group.id}/app/widgets/filter`)
      .pipe(map(data => this.filterDataAdapter.adapt(data)));
  }

  getFilterDataForDepartment(group: Group, departmentId: number): Observable<FilterData> {
    return this.httpClient.get(`${environment.api}/groups/${group.id}/app/overview/departments/${departmentId}/filter`)
      .pipe(map(data => this.filterDataAdapter.adapt(data)));
  }

  fetchMyOrganizationFilter(group: Group): Observable<FilterData> {
    return this.httpClient.get(`${environment.api}/groups/${group.id}/app/my-organization/filter`)
      .pipe(map(data => this.filterDataAdapter.adapt(data)));
  }
}
