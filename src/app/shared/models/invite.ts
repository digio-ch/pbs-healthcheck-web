import * as moment from 'moment';

export class Invite {
  constructor(
    public id?: number,
    public email?: string,
    public expirationDate?: string
  ) {
  }

  getFormattedDate(): string {
    return moment(this.expirationDate).format('DD.MM.YYYY');
  }
}
