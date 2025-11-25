import {Injectable} from '@angular/core';
import {WidgetState} from '../state/widget.state';
import {WidgetService} from '../services/widget.service';
import {map, tap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Group} from '../../shared/models/group';
import {CensusFilterState} from '../services/census-filter.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetFacade {
  constructor(
    private widgetState: WidgetState,
    private widgetService: WidgetService,
  ) {
  }

  hasError$(): Observable<boolean> {
    return this.widgetState.hasError$();
  }

  isLoading$(): Observable<boolean> {
    return this.widgetState.isLoading$();
  }

  public refreshOverviewData(
    dateSelection: DateSelection,
    group: Group,
    peopleTypes: string[],
    groupTypes: string[],
  ): Observable<any> {
    const widgets = this.widgetState.getWidgetsSnapshot();
    this.widgetState.setLoading(true);

    let request: Observable<any>;

    if (!dateSelection.isRange) {
      request = this.widgetService.getOverviewWidgetsDataForDate(
        group,
        dateSelection.startDate.format('YYYY-MM-DD'),
        peopleTypes,
        groupTypes,
        widgets,
      );
    } else {
      request = this.widgetService.getOverviewWidgetsDataForRange(
        group,
        dateSelection,
        peopleTypes,
        groupTypes,
        widgets,
      );
    }

    return request.pipe(
      tap({
        next: res => this.processResponse(res, dateSelection.isRange), 
        error: () => this.widgetState.setError(true), 
        complete: () => {this.widgetState.setLoading(false)}
      })
    );
  }

  public refreshOverviewDataOfDepartment(
    dateSelection: DateSelection,
    group: Group,
    departmentId: number,
    peopleTypes: string[],
    groupTypes: string[],
  ): Observable<any> {
    const widgets = this.widgetState.getWidgetsSnapshot();
    this.widgetState.setLoading(true);

    let request: Observable<any>;

    if (!dateSelection.isRange) {
      request = this.widgetService.getOverviewWidgetsDataOfDepartmentForDate(
        group,
        departmentId,
        dateSelection.startDate.format('YYYY-MM-DD'),
        peopleTypes,
        groupTypes,
        widgets,
      );
    } else {
      request = this.widgetService.getOverviewWidgetsDataOfDepartmentForRange(
        group,
        departmentId,
        dateSelection,
        peopleTypes,
        groupTypes,
        widgets,
      );
    }

    return request.pipe(
      tap({
        next: res => this.processResponse(res, dateSelection.isRange), 
        error: () => this.widgetState.setError(true), 
        complete: () => {this.widgetState.setLoading(false)}
      })
    );

  }

  public refreshCensusData(
    group: Group,
    censusFilterState: CensusFilterState
  ): Observable<any> {
    const widgets = this.widgetState.getWidgetsSnapshot();
    this.widgetState.setLoading(true);

    return this.widgetService.getCensusWidgetsDataForDate(
      group, 
      widgets, 
      censusFilterState,
    ).pipe(
      tap({
        next: res => this.processResponse(res, false), 
        error: () => this.widgetState.setError(true), 
        complete: () => this.widgetState.setLoading(false),
      })
    );
  }

  public getWidgetsSnapshot(): Widget[] {
    return this.widgetState.getWidgetsSnapshot();
  }

  public getWidgets$(): Observable<Widget[]> {
    return this.widgetState.getWidgets$();
  }

  public getWidgetData$(): Observable<Widget[]> {
    return combineLatest([
      this.widgetState.getWidgets$(),
      this.widgetState.getWidgetData$(),
    ]).pipe(
      map(([widgets, widgetData]) => {
        widgets.forEach(w => {
          if (w.uid in widgetData) {
            w.data = widgetData[w.uid];
          }
        });
        return widgets;
      })
    );
  }

  private processResponse(responses: any[], isRange: boolean) {
    const tempWidgets = this.widgetState.getWidgetsSnapshot().filter((w: Widget) => {
      return (w.supportsRange && isRange) || (w.supportsDate && !isRange);
    });

    const widgetData = {};
    tempWidgets.forEach((w: Widget, index: number) => {
      widgetData[w.uid] = responses[index];
    });

    this.widgetState.setWidgetData(widgetData);
  }
}
