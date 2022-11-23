import {TypeFilter} from './type-filter';

export class GroupType extends TypeFilter {
  static FEDERAL = 1;
  static CANTONAL = 2;
  static REGIONAL = 3;
  static DEPARTMENT = 8;

  static FEDERAL_KEY = 'Group::Bund';
  static CANTONAL_KEY = 'Group::Kantonalverband';
  static REGIONAL_KEY = 'Group::Region';
  static DEPARTMENT_KEY = 'Group::Abteilung';

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
