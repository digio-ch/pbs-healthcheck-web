import {Injectable} from '@angular/core';
import {WidgetState} from '../state/widget.state';
import {WidgetService} from '../services/widget.service';
import {map, take} from 'rxjs/operators';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Group} from '../../shared/models/group';
import {CensusFilterState} from '../services/census-filter.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetFacade {

  private currentRequest: Subscription;

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

  refreshData(dateSelection: DateSelection, group: Group, peopleTypes: string[], groupTypes: string[], censusFilterState: CensusFilterState): Promise<boolean> {
    if (this.widgetState.isLoadingSnapshot()) {
      this.currentRequest.unsubscribe();
      this.currentRequest = null;
    }

    const widgets = this.widgetState.getWidgetsSnapshot();
    this.widgetState.setLoading(true);

    let request: Observable<any>;

    if (!dateSelection.isRange) {
      request = this.widgetService.getWidgetsDataForDate(
        group,
        dateSelection.startDate.format('YYYY-MM-DD'),
        peopleTypes,
        groupTypes,
        widgets,
        censusFilterState
      ).pipe(
        take(1),
      );

      return new Promise<boolean>(resolve => {
        this.currentRequest = request.subscribe(responses => {
          this.processResponse(responses, false);
          resolve(true);
        }, () => {
          this.widgetState.setError(true);
          resolve(false);
        }, () => {
          this.widgetState.setLoading(false);
          this.currentRequest = null;
        });
      });
    }

    request = this.widgetService.getWidgetsDataForRange(group, dateSelection, peopleTypes, groupTypes, widgets).pipe(
      take(1),
    );

    return new Promise<boolean>(resolve => {
      this.currentRequest = request.subscribe(responses => {
        this.processResponse(responses, true);
        resolve(true);
      }, () => {
        this.widgetState.setError(true);
        resolve(false);
      }, () => {
        this.widgetState.setLoading(false);
      });
    });
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
