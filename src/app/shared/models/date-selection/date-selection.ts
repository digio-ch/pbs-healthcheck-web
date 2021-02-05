import * as moment from 'moment';

export class DateSelection {
  constructor(
    public startDate: moment.Moment,
    public endDate: moment.Moment,
    public isRange: boolean
  ) {
  }

  public getISOStartDate(): string {
    return this.startDate.format('YYYY-MM-DD');
  }

  public getISOEndDate(): string {
    return this.endDate.format('YYYY-MM-DD');
  }

  public getDisplayValue(): string {
    if (this.isRange) {
      return this.startDate.format('DD.MM.YY') + ' - ' + this.endDate.format('DD.MM.YY');
    }
    return this.startDate.format('DD.MM.YY');
  }

  clone(): DateSelection {
    return new DateSelection(
      this.startDate,
      this.endDate,
      this.isRange
    );
  }
}
