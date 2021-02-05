import {Adapter} from './adapter';
import {GroupType} from '../models/group-type';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupTypeAdapter extends Adapter<GroupType> {
  adapt(item: any): GroupType {
    return new GroupType(
      item.id,
      item.groupType,
      item.label,
      item.color,
      true
    );
  }
}
