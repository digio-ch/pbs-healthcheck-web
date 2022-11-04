import {Injectable} from '@angular/core';
import {DateState} from '../state/date.state';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {BehaviorSubject, Observable} from 'rxjs';
import {DateModel} from '../../shared/models/date-selection/date.model';
import {DateQuickSelectionOptions} from '../../shared/models/date-selection/date-quick-selection-options';
import {Group} from '../../shared/models/group';
import {DateService} from '../services/date.service';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DateFacade {
  private loading = new BehaviorSubject<boolean>(false);

  constructor(
    private dateState: DateState,
    private dateService: DateService,
  ) {
  }

  loadFilterData(group: Group): void {
    this.loading.next(true);
    this.dateService.getFilterData(group).pipe(
      first(),
    ).subscribe(dates => {
      this.dateState.setAvailableDates(dates);
      this.setDateSelection(new DateSelection(
        dates[0].date,
        null,
        false
      ));
    },
      () => {},
      () => this.loading.next(false),
    );
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

  isLoading$(): Observable<boolean> {
    return this.loading.asObservable();
  }
}
