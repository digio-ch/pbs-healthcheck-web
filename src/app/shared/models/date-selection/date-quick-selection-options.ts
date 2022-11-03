import {DateModel} from './date.model';
import * as moment from 'moment';
import {DateSelection} from './date-selection';
import {DateQuickSelectionOption} from './date-quick-selection-option';

export class DateQuickSelectionOptions {
  public dateOptions: DateQuickSelectionOption[] = [];
  public rangeOptions: DateQuickSelectionOption[] = [];

  constructor(private availableDates: DateModel[]) {
    this.initOptions();
  }

  private initOptions() {
    this.initLatest();
    this.initFirstOfTheYear();
    this.initRangeBeginningOfYear();
    this.initRangeBeginningOfLastYear();
    this.initRangeLastFiveYears();
  }

  initLatest() {
    const selection = new DateSelection(
      this.availableDates[0].date,
      this.availableDates[0].date,
      false
    );
    this.dateOptions.push(new DateQuickSelectionOption(true, selection, 'datePicker.date.latest'));
  }

  initFirstOfTheYear() {
    const label = 'datePicker.date.beggingOfYear';
    const indexForFirstOfTheYear = this.findIndexForDate(moment());
    if (indexForFirstOfTheYear < 0) {
      this.dateOptions.push(new DateQuickSelectionOption(false, null, label));
      return;
    }
    const selection = new DateSelection(
      this.availableDates[indexForFirstOfTheYear].date,
      this.availableDates[indexForFirstOfTheYear].date,
      false
    );
    this.dateOptions.push(new DateQuickSelectionOption(true, selection, label));
  }

  initRangeBeginningOfYear() {
    const label = 'datePicker.range.beggingOfYear';
    const indexForFirstOfTheYear = this.findIndexForDate(moment());
    if (indexForFirstOfTheYear < 0) {
      this.rangeOptions.push(new DateQuickSelectionOption(false, null, label));
      return;
    }
    const selection = new DateSelection(
      this.availableDates[indexForFirstOfTheYear].date,
      this.availableDates[0].date,
      true
    );
    this.rangeOptions.push(new DateQuickSelectionOption(true, selection, label));
  }

  initRangeBeginningOfLastYear() {
    const label = 'datePicker.range.beggingOfLastYear';
    const indexForFirstOfLastYear = this.findIndexForDate(moment().subtract(1, 'years'));
    if (indexForFirstOfLastYear < 0) {
      this.rangeOptions.push(new DateQuickSelectionOption(false, null, label));
      return;
    }
    const selection = new DateSelection(
      this.availableDates[indexForFirstOfLastYear].date,
      this.availableDates[0].date,
      true
    );
    this.rangeOptions.push(new DateQuickSelectionOption(true, selection, label));
  }

  initRangeLastFiveYears() {
    const label = 'datePicker.range.lastFiveYears';
    const index = this.findIndexForDate(moment().subtract(5, 'years'));
    if (index < 0) {
      this.rangeOptions.push(new DateQuickSelectionOption(false, null, label));
      return;
    }
    const selection = new DateSelection(
      this.availableDates[index].date,
      this.availableDates[0].date,
      true
    );
    this.rangeOptions.push(new DateQuickSelectionOption(true, selection, label));
  }

  private findIndexForDate(date: moment.Moment): number {
    return this.availableDates.findIndex((item: DateModel) => {
      return item.date.format('DD.MM.YYYY') === '01.01.' + date.format('YYYY');
    });
  }
}
