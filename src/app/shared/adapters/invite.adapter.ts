import {Adapter} from './adapter';
import {Invite} from '../models/invite';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InviteAdapter extends Adapter<Invite> {
  adapt(item: any): Invite {
    return new Invite(
      item.id,
      item.email,
      item.expirationDate,
    );
  }
}
