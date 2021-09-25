import {Adapter} from './adapter';
import {Person} from '../models/person';
import {Injectable} from '@angular/core';
import {GroupAdapter} from './group.adapter';

@Injectable({
  providedIn: 'root'
})
export class PersonAdapter extends Adapter<Person> {
  constructor(
    private groupAdapter: GroupAdapter
  ) {
    super();
  }

  adapt(item: any): Person {
    return new Person(
      item.id,
      item.email,
      item.firstName,
      item.lastName,
      item.nickName,
      item.birthday,
      item.address,
      item.zipCode,
      item.town,
      item.country,
      item.correspondenceLanguage,
      item.gender,
      item.syncableGroups ? this.groupAdapter.adaptArray(item.syncableGroups) : [],
      item.readableGroups ? this.groupAdapter.adaptArray(item.readableGroups) : []
    );
  }
}
