import {TypeFilter} from './type-filter';

export class GroupType extends TypeFilter {
  constructor(
    public id: number,
    public groupType: string,
    public label: string,
    public color: string,
    public selected = false
  ) {
    super(label, color, selected);
  }
}
