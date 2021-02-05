import * as moment from 'moment';
import {Qualification} from './qualification';

export class Leader {
  constructor(
    public name: string,
    public birthday: string,
    public gender: string,
    public qualifications: Qualification[]
  ) {}

  getDisplayName(): string {
    return this.name + ' ' + this.calculateAge();
  }

  calculateAge(): number {
    return moment().diff(moment(this.birthday), 'years');
  }
}
