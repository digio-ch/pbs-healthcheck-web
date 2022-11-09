import {Injectable} from '@angular/core';
import {WidgetState} from '../state/widget.state';
import {WidgetService} from '../services/widget.service';
import {take} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Group} from '../../shared/models/group';

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

  isLoadingSnapshot(): boolean {
    return this.widgetState.isLoadingSnapshot();
  }

  refreshData(dateSelection: DateSelection, group: Group, peopleTypes: string[], groupTypes: string[]): Promise<boolean> {
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
      ).pipe(
        take(1),
      );

      return new Promise<boolean>(resolve => {
        this.currentRequest = request.subscribe(responses => {
          this.processResponse(responses, false);
          resolve(true);
        }, () => {
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
        resolve(false);
      }, () => {
        this.widgetState.setLoading(false);
      });
    });
  }

  public getWidgetsSnapshot(): Widget[] {
    return this.widgetState.getWidgetsSnapshot();
  }

  public getWidgetData$(): Observable<Widget[]> {
    return this.widgetState.getWidgetData$();
  }

  private processResponse(responses: any[], isRange: boolean) {
    const tempWidgets = this.widgetState.getWidgetsSnapshot().filter((w: Widget) => {
      return (w.supportsRange && isRange) || (w.supportsDate && !isRange);
    });
    tempWidgets.forEach((w: Widget, index: number) => {
      if (w.supportsDate && !isRange) {
        this.widgetState.setWidgetDataForKey(w.uid, responses[index]);
        return;
      }
      if (w.supportsRange && isRange) {
        this.widgetState.setWidgetDataForKey(w.uid, responses[index]);
        return;
      }
    });
    this.widgetState.setWidgetData(tempWidgets);
  }
}
