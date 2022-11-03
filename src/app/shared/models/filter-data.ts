import {GroupType} from './group-type';
import {DateModel} from './date-selection/date.model';

export class FilterData {
  constructor(
    public dates: DateModel[],
    public groupTypes: GroupType[]
  ) { }
}
