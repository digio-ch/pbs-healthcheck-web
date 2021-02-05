import {Adapter} from '../adapter';
import {Leader} from '../../models/leader-overview/leader';
import {Injectable} from '@angular/core';
import {QualificationAdapter} from './qualification.adapter';

@Injectable({
  providedIn: 'root'
})
export class LeaderAdapter extends Adapter<Leader> {
  constructor(private qualificationAdapter: QualificationAdapter) {
    super();
  }
  adapt(item: any): Leader {
    return new Leader(
      item.name,
      item.birthday,
      item.gender,
      this.qualificationAdapter.adaptArray(item.qualifications)
    );
  }
}
