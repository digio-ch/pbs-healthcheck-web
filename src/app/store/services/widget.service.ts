import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Group } from '../../shared/models/group';
import { DateSelection } from '../../shared/models/date-selection/date-selection';
import { Widget } from '../../shared/models/widget';
import { ApiService } from '../../shared/services/api.service';
import { CensusFilterService, CensusFilterState } from './census-filter.service';
import { TimeFrame } from 'src/app/shared/models/timeframe';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private apiService = inject(ApiService);
  private censusFilterService = inject(CensusFilterService);


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

  getOverviewWidgetsDataOfDepartmentForRange(
    group: Group,
    departmentId: number,
    dateSelection: DateSelection,
    peopleTypes: string[],
    groupTypes: string[],
    widgets: Widget[],
  ): Observable<any> {
    let params = this.createOverviewWidgetFilterParams(peopleTypes, groupTypes);
    params = params.append('from', dateSelection.startDate.format('YYYY-MM-DD'));
    params = params.append('to', dateSelection.endDate.format('YYYY-MM-DD'));

    const supportedWidgets = widgets.filter(w => w.supportsRange);

    return this.getDataOfDepartment(group, departmentId, supportedWidgets, params);
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

  getOverviewWidgetsDataOfDepartmentForDate(
    group: Group,
    departmentId: number,
    date: string,
    peopleTypes: string[],
    groupTypes: string[],
    widgets: Widget[],
  ): Observable<any> {
    let params = this.createOverviewWidgetFilterParams(peopleTypes, groupTypes);
    params = params.append('date', date);

    const supportedWidgets = widgets.filter(w => w.supportsDate);

    return this.getDataOfDepartment(group, departmentId, supportedWidgets, params);
  }

    getMyOrganizationWidgetsData(
    group: Group,
    timeFrame: TimeFrame,
    peopleTypes: string[],
    groupTypes: string[],
    widgets: Widget[],
  ): Observable<any> {
    const params = this.mapToDepartmentFilterParams(peopleTypes, groupTypes, timeFrame);

    const supportedWidgets = widgets.filter(w => timeFrame.isRange ? w.supportsRange : w.supportsDate);

    return this.fetchMyOrganizationData(group, supportedWidgets, params);    
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

  private mapToDepartmentFilterParams(peopleTypes: string[], groupTypes: string[], timeFrame: TimeFrame): HttpParams {
      const params = new HttpParams().appendAll({
        'relevant-data[]': peopleTypes,
        'group-types[]': groupTypes,
      });

      return this.addTimeFrameFilterParams(params, timeFrame);
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

  private addTimeFrameFilterParams(params: HttpParams, timeFrame: TimeFrame): HttpParams {
    if (timeFrame.isRange === false) {
      return params.append('date', this.formatDate(timeFrame.date));
    } 

    return params.appendAll({
      'from': this.formatDate(timeFrame.from),
      'to': this.formatDate(timeFrame.to)
    });
  }

  private formatDate(date: moment.Moment): string {
    return date.format('YYYY-MM-DD');
  }

  private getData(group: Group, widgets: Widget[], params: HttpParams): Observable<any> {
    return this.fetchWidgets(widgets, (widget) => {
      return this.apiService.get(`groups/${group.id}/app/widgets/${widget.uid}`, { params });
    });
  }

  private getDataOfDepartment(group: Group, departmentId: number, widgets: Widget[], params: HttpParams): Observable<any> {
    return this.fetchWidgets(widgets, (widget) => {
      return this.apiService.get(`groups/${group.id}/app/overview/departments/${departmentId}/${widget.uid}`, { params });
    });
  }

  private fetchMyOrganizationData(group: Group, widgets: Widget[], params: HttpParams): Observable<Record<string, any>> {
    return this.fetchWidgets(widgets, (widget) => {
      return this.apiService.get(`groups/${group.id}/app/my-organization/${widget.uid}`, { params });
    });
  }

  /**
   * Fetches the widgets with the given fetch function and returns a record that maps the widget uid to the data
   */
  private fetchWidgets(widgets: Widget[], fetchFn: (widget: Widget) => Observable<any>): Observable<Record<string, any>> {
    const responses: Observable<any>[] = [];

    for (const widget of widgets) {
      const res = fetchFn(widget).pipe(
        map(data => ({
          uid: widget.uid,
          data: data,
        })),
      );

      responses.push(res);
    }

    return forkJoin(responses).pipe(
      map(responses => responses.reduce((obj, res) => {
        obj[res.uid] = res.data
        return obj;
      }, {})),
    );
  }
}
