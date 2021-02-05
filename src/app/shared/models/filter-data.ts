import {GroupType} from './group-type';
import {FilterDate} from './date-selection/filter-date';

export class FilterData {
  constructor(
    public dates: FilterDate[],
    public groupTypes: GroupType[]
  ) { }
}
