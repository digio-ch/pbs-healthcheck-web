import { GroupType } from './group-type';
import { DateModel } from './date-selection/date.model';

export interface FilterData {
  groupTypes: GroupType[]
  dates: DateModel[]
}
