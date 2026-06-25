import { Injectable, inject } from '@angular/core';
import { WidgetState } from '../state/widget.state';
import { WidgetService } from '../services/widget.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Widget } from '../../shared/models/widget';
import { DateSelection } from '../../shared/models/date-selection/date-selection';
import { Group } from '../../shared/models/group';
import { CensusFilterState } from '../services/census-filter.service';
import { TimeFrameFromDateSelection } from 'src/app/shared/models/timeframe';
import { PageType } from 'src/app/apps/widget/services/widget-type.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetFacade {
  private widgetState = inject(WidgetState);
  private widgetService = inject(WidgetService);


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
    const widgets = this.widgetState.getWidgets('overview');
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
        next: res => this.widgetState.setWidgetData(res), 
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
    const widgets = this.widgetState.getWidgets('overview-department');
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
        next: res => this.widgetState.setWidgetData(res), 
        error: () => this.widgetState.setError(true), 
        complete: () => {this.widgetState.setLoading(false)}
      })
    );

  }

  public refreshMyOrganizationData(
    dateSelection: DateSelection,
    group: Group,
    peopleTypes: string[],
    groupTypes: string[],
  ): Observable<any> {
    const widgets = this.widgetState.getWidgets('my-organization');
    this.widgetState.setLoading(true);

    const request = this.widgetService.getMyOrganizationWidgetsData(
      group, 
      TimeFrameFromDateSelection(dateSelection),
      peopleTypes,
      groupTypes,
      widgets,
    );

    return request.pipe(
      tap({
        next: res => this.widgetState.setWidgetData(res), 
        error: () => this.widgetState.setError(true), 
        complete: () => {this.widgetState.setLoading(false)}
      })
    );

  }

  public refreshCensusData(
    group: Group,
    censusFilterState: CensusFilterState
  ): Observable<any> {
    const widgets = this.widgetState.getWidgets('census');
    this.widgetState.setLoading(true);

    return this.widgetService.getCensusWidgetsDataForDate(
      group, 
      widgets, 
      censusFilterState,
    ).pipe(
      tap({
        next: res => this.widgetState.setWidgetData(res), 
        error: () => this.widgetState.setError(true), 
        complete: () => this.widgetState.setLoading(false),
      })
    );
  }

  public getWidgets(pageType: PageType): Widget[] {
    return this.widgetState.getWidgets(pageType);
  }

  public getWidgetData$(pageType: PageType): Observable<Widget[]> {
    return this.widgetState.getWidgetData$().pipe(
      map(widgetData =>
        this.widgetState.getWidgets(pageType).map(w => {
          if (w.uid in widgetData) {
            w.data = widgetData[w.uid];
          }

          return w;
        }),
      )
    )
  }
}
