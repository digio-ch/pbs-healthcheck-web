import {Injectable} from '@angular/core';
import {WidgetState} from '../state/widget.state';
import {WidgetService} from '../services/widget.service';
import {take} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {DataHandlerFacade} from "./data.facade";
import {DateSelection} from "../../shared/models/date-selection/date-selection";
import {Group} from "../../shared/models/group";

@Injectable({
  providedIn: 'root'
})
export class WidgetFacade implements DataHandlerFacade {

  currentRequest: Subscription = null;

  constructor(
    private widgetState: WidgetState,
    private widgetService: WidgetService,
  ) { }

  hasError$(): Observable<boolean> {
    return this.widgetState.hasError$();
  }

  isLoading$(): Observable<boolean> {
    return this.widgetState.isLoading$();
  }

  isLoadingSnapshot(): boolean {
    return this.widgetState.isLoadingSnapshot();
  }

  refreshData(dateSelection: DateSelection, group: Group, peopleTypes: string[], groupTypes: string[]): void {
    if (this.widgetState.isLoadingSnapshot()) {
      return;
    }

    const widgets = this.widgetState.getWidgetsSnapshot();
    this.widgetState.setLoading(true);

    if (!dateSelection.isRange) {
      if (this.currentRequest !== null) {
        this.currentRequest.unsubscribe();
      }
      this.currentRequest = this.widgetService.getWidgetsDataForDate(group, dateSelection.startDate.format('YYYY-MM-DD'), peopleTypes, groupTypes, widgets)
        .pipe(take(1)).subscribe(
          responses => {
            this.processResponse(responses, false);
            this.widgetState.setError(false);
          },
          error => {
            this.widgetState.setLoading(false);
            this.widgetState.setError(true);
          },
          () => this.widgetState.setLoading(false)
        );
      return;
    }

    this.widgetService.getWidgetsDataForRange(group, dateSelection, peopleTypes, groupTypes, widgets)
      .pipe(take(1)).subscribe(
        responses => {
          this.processResponse(responses, true);
          this.widgetState.setError(false);
        },
        error => {
          this.widgetState.setLoading(false);
          this.widgetState.setError(true);
        },
        () => this.widgetState.setLoading(false)
      );
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
  }
}
