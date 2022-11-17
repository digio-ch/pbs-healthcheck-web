import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {DateModel} from '../../shared/models/date-selection/date.model';
import {DateQuickSelectionOptions} from '../../shared/models/date-selection/date-quick-selection-options';

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
    return this.dateSelection.asObservable();
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
    return this.availableDates.asObservable();
  }

  getAvailableDatesSnapshot(): DateModel[] {
    return this.availableDates.value;
  }

  setAvailableDates(dates: DateModel[]) {
    this.availableDates.next(dates);
    this.dateQuickSelectionOptions.next(new DateQuickSelectionOptions(dates));
  }
}
