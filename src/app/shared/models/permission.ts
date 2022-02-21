import * as moment from 'moment';

export class Permission {
  constructor(
    public id?: number,
    public email?: string,
    public permissionType?: string,
    public expirationDate?: string
  ) {
  }

  getFormattedDate(): string {
    return moment(this.expirationDate).format('DD.MM.YYYY');
  }
}
