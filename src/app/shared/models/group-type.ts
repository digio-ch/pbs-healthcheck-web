import {TypeFilter} from './type-filter';

export class GroupType extends TypeFilter {
  static FEDERAL = 1;
  static CANTONAL = 2;
  static REGIONAL = 3;
  static DEPARTMENT = 8;

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
