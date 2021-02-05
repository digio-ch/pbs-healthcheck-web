import * as moment from 'moment';

export class FilterDate {
  constructor(
    public date: moment.Moment,
    public selected = false,
  ) {
  }

  public getISODate(): string {
    return this.date.format('YYYY-MM-DD');
  }
}
