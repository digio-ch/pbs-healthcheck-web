import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Observable } from 'rxjs';
import { DateSelection } from '../../shared/models/date-selection/date-selection';
import { DateModel } from '../../shared/models/date-selection/date.model';
import { DateQuickSelectionOptions } from '../../shared/models/date-selection/date-quick-selection-options';

@Injectable({
  providedIn: 'root',
})
export class DateState {
  private availableDates = new BehaviorSubject<DateModel[]>(null);
  private dateSelection = new BehaviorSubject<DateSelection>(null);
  private dateQuickSelectionOptions = new BehaviorSubject<DateQuickSelectionOptions>(null);

  setDateSelection(selection: DateSelection) {
    this.dateSelection.next(selection);
  }

  getDateSelection$(): Observable<DateSelection> {
    return this.dateSelection.pipe(
      filter(dateSelection => !!dateSelection),
      // currently the date section is fetched twice because of the default filter and the date filter. This needs to be refactored. 
      // In the mean time we just ignore that using distinctUntilChanged.
      distinctUntilChanged((a, b) => {
        if (!a.startDate.isSame(b.startDate, 'date')) {
          return false;
        }

        if ((a.isRange && !b.isRange) || (!a.isRange && b.isRange)) {
          return false;
        }

        if (!a.isRange && !b.isRange) {
          return true;
        }

        return a.endDate.isSame(b.endDate);
      })
    );
  }

  getDateSelectionSnapshot(): DateSelection {
    return this.dateSelection.value;
  }

  getDateQuickSelectionOptions$(): Observable<DateQuickSelectionOptions> {
    return this.dateQuickSelectionOptions.asObservable();
  }

  getDateQuickSelectionOptionsSnapshot(): DateQuickSelectionOptions {
    return this.dateQuickSelectionOptions.value;
  }

  getAvailableDates$(): Observable<DateModel[]> {
    return this.availableDates.pipe(
      filter(availableDates => !!availableDates)
    )
  }

  getAvailableDatesSnapshot(): DateModel[] {
    return this.availableDates.value;
  }

  setAvailableDates(dates: DateModel[]) {
    this.availableDates.next(dates);
    this.dateQuickSelectionOptions.next(new DateQuickSelectionOptions(dates));
  }
}
