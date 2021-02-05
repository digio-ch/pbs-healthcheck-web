import {Adapter} from '../adapter';
import {Qualification} from '../../models/leader-overview/qualification';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QualificationAdapter extends Adapter<Qualification> {
  adapt(item: any): Qualification {
    return new Qualification(
      item.state,
      item.shortName,
      item.fullName,
      item.eventOrigin,
      item.expiresAt,
      item.color
    );
  }

}
