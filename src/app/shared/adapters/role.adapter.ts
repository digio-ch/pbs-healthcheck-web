import {Adapter} from './adapter';
import {Injectable} from '@angular/core';
import {Role} from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleAdapter extends Adapter<Role> {
  adapt(item: any): Role {
    return new Role(
      item.groupId,
      item.groupName,
      item.roleType,
    );
  }
}
