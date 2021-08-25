import {Injectable} from '@angular/core';
import {WidgetState} from '../state/widget.state';
import {WidgetService} from '../services/widget.service';
import {take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {DateSelection} from "../../shared/models/date-selection/date-selection";
import {Group} from "../../shared/models/group";
import {DataProviderService} from '../../shared/services/data-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetFacade extends DataProviderService {

  constructor(
    private widgetState: WidgetState,
    private widgetService: WidgetService,
  ) {
    super();
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
      return Promise.resolve(true);
    }

    const widgets = this.widgetState.getWidgetsSnapshot();
    this.widgetState.setLoading(true);

    if (!dateSelection.isRange) {
      return this.widgetService.getWidgetsDataForDate(
        group,
        dateSelection.startDate.format('YYYY-MM-DD'),
        peopleTypes,
        groupTypes,
        widgets,
      ).pipe(
        take(1),
      ).toPromise().then(responses => {
        this.processResponse(responses, false);
        this.setData(true);
        return true;
      }).catch(error => {
        return false;
      });
    }

    return this.widgetService.getWidgetsDataForRange(group, dateSelection, peopleTypes, groupTypes, widgets).pipe(
      take(1),
    ).toPromise().then(responses => {
      this.processResponse(responses, true);
      this.setData(true);
      return true;
    }).catch(error => {
      return false;
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
  }
}
