import { Injectable } from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {Group} from '../../shared/models/group';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Widget} from '../../shared/models/widget';
import {ApiService} from '../../shared/services/api.service';
import {CensusFilterService, CensusFilterState} from './census-filter.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(
    private apiService: ApiService,
    private censusFilterService: CensusFilterService,
  ) { }

  getOverviewWidgetsDataForRange(
    group: Group,
    dateSelection: DateSelection,
    peopleTypes: string[],
    groupTypes: string[],
    widgets: Widget[],
  ): Observable<any> {
    let params = this.createOverviewWidgetFilterParams(peopleTypes, groupTypes);
    params = params.append('from', dateSelection.startDate.format('YYYY-MM-DD'));
    params = params.append('to', dateSelection.endDate.format('YYYY-MM-DD'));

    const supportedWidgets = widgets.filter(w => w.supportsRange);

    return this.getData(group, supportedWidgets, params);
  }

  getOverviewWidgetsDataForDate(
    group: Group,
    date: string,
    peopleTypes: string[],
    groupTypes: string[],
    widgets: Widget[],
  ): Observable<any> {
    let params = this.createOverviewWidgetFilterParams(peopleTypes, groupTypes);
    params = params.append('date', date);

    const supportedWidgets = widgets.filter(w => w.supportsDate);

    return this.getData(group, supportedWidgets, params);
  }

  getCensusWidgetsDataForDate(
    group: Group,
    widgets: Widget[],
    censusFilterState: CensusFilterState,
  ): Observable<any> {
    const params = this.censusFilterService.mapCensusFilterToHTTPParams(censusFilterState, new HttpParams());

    const supportedWidgets = widgets.filter(w => w.supportsDate);

    return this.getData(group, supportedWidgets, params);
  }

  private createOverviewWidgetFilterParams(peopleTypes: string[], groupTypes: string[]): HttpParams {
    let params = new HttpParams();
    peopleTypes.forEach(item => {
      params = params.append('relevant-data[]', item);
    });
    groupTypes.forEach(item => {
      params = params.append('group-types[]', item);
    });

    return params;
  }

  private getData(group: Group, widgets: Widget[], params: HttpParams): Observable<any> {
    const responses = [];

    for (const widget of widgets) {
      responses.push(this.apiService.get(`groups/${group.id}/app/widgets/${widget.uid}`, { params }));
    }

    return forkJoin(responses);
  }
}
