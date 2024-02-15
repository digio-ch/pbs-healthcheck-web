import {TypeFilter} from './type-filter';

export class PeopleType extends TypeFilter {
  constructor(
    public name: string,
    public color: string = '#005716',
    public selected = true
  ) {
    super(name, color, selected);
  }
}
