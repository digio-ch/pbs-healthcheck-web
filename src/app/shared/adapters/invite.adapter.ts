import {Adapter} from './adapter';
import {Permission} from '../models/permission';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InviteAdapter extends Adapter<Permission> {
  adapt(item: any): Permission {
    return new Permission(
      item.id,
      item.email,
      item.permissionType,
      item.expirationDate,
    );
  }
}
