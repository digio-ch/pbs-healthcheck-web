import {Adapter} from './adapter';
import {Permission} from '../models/permission';
import {Injectable} from '@angular/core';
import {DateAdapter} from './dateAdapter';

@Injectable({
  providedIn: 'root'
})
export class InviteAdapter extends Adapter<Permission> {
  constructor(private dateAdapter: DateAdapter) {
    super();
  }
  adapt(item: any): Permission {
    return new Permission(
      item.id,
      item.email,
      item.permissionType,
      this.dateAdapter.adapt(item.expirationDate),
    );
  }
}
