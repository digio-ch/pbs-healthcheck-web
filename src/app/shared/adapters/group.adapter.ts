import {Adapter} from './adapter';
import {Group} from '../models/group';
import {Injectable} from '@angular/core';
import {GroupTypeAdapter} from './group-type.adapter';

@Injectable({
  providedIn: 'root'
})
export class GroupAdapter extends Adapter<Group> {

  constructor(private groupTypeAdapter: GroupTypeAdapter) {
    super();
  }

  adapt(item: any): Group {
    const groupType = this.groupTypeAdapter.adapt(item.groupType);
    return new Group(
      item.id,
      item.name,
      item.cantonName,
      item.createdAt,
      item.deletedAt,
      item.permissionType,
      groupType
    );
  }

}
