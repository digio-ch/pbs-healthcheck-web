import { Injectable } from '@angular/core';
import {forkJoin} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Group} from '../../shared/models/group';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Widget} from '../../shared/models/widget';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(private http: HttpClient) { }

  getWidgetsDataForRange(
    group: Group,
    dateSelection: DateSelection,
    peopleTypes: string[],
    groupTypes: string[],
    widgets: Widget[]
  ) {
    const baseUrl = environment.api + '/groups/' + group.id + '/';
    let params = new HttpParams();
    peopleTypes.forEach(item => {
      params = params.append('relevant-data[]', item);
    });
    groupTypes.forEach(item => {
      params = params.append('group-types[]', item);
    });
    params = params.append('from', dateSelection.startDate.format('YYYY-MM-DD'));
    params = params.append('to', dateSelection.endDate.format('YYYY-MM-DD'));
    const responses = [];
    for (const w of widgets) {
      if (!w.supportsRange) {
        continue;
      }
      responses.push(this.http.get(baseUrl + w.uid, {params}));
    }
    return forkJoin(responses);
  }

  getWidgetsDataForDate(
    group: Group,
    date: string,
    peopleTypes: string[],
    groupTypes: string[],
    widgets: Widget[]
  ) {
    const baseUrl = environment.api + '/groups/' + group.id + '/';
    let params = new HttpParams();
    peopleTypes.forEach(item => {
      params = params.append('relevant-data[]', item);
    });
    groupTypes.forEach(item => {
      params = params.append('group-types[]', item);
    });
    params = params.append('date', date);
    const responses = [];
    for (const w of widgets) {
      if (!w.supportsDate) {
        continue;
      }
      responses.push(this.http.get(baseUrl + w.uid, {params}));
    }
    return forkJoin(responses);
  }
}
