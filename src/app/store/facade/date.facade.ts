import {Injectable} from '@angular/core';
import {DateState} from '../state/date.state';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {Observable} from 'rxjs';
import {DateModel} from '../../shared/models/date-selection/date.model';
import {DateQuickSelectionOptions} from '../../shared/models/date-selection/date-quick-selection-options';

@Injectable({
  providedIn: 'root',
})
export class DateFacade {
  constructor(
    private dateState: DateState,
  ) {
  }

  getDateSelection$(): Observable<DateSelection> {
    return this.dateState.getDateSelection$();
  }

  getDateSelectionSnapshot(): DateSelection {
    return this.dateState.getDateSelectionSnapshot();
  }

  isTodaySelected(): boolean {
    const dateSelection = this.getDateSelectionSnapshot();
    if (dateSelection.isRange) {
      return false;
    }
    return dateSelection.startDate === this.dateState.getAvailableDatesSnapshot()[0].date;
  }

  setDateSelection(dateSelection: DateSelection) {
    this.dateState.setDateSelection(dateSelection);
  }

  getAvailableDates$(): Observable<DateModel[]> {
    return this.dateState.getAvailableDates$();
  }

  setAvailableDates(dates: DateModel[]) {
    this.dateState.setAvailableDates(dates);
  }

  getAvailableDateQuickSelectionOptions$(): Observable<DateQuickSelectionOptions> {
    return this.dateState.getDateQuickSelectionOptions$();
  }

  getAvailableDateQuickSelectionOptionsSnapshot(): DateQuickSelectionOptions {
    return this.dateState.getDateQuickSelectionOptionsSnapshot();
  }
}
