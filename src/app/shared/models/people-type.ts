import {TypeFilter} from './type-filter';

export class PeopleType extends TypeFilter {
  constructor(
    public name: string,
    public color: string = '#929292',
    public selected = true
  ) {
    super(name, color, selected);
  }
}
