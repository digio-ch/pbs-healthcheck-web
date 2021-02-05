import {Adapter} from '../adapter';
import {LeaderOverviewGroup} from '../../models/leader-overview/leader-overview-group';
import {LeaderAdapter} from './leader.adapter';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaderOverviewGroupAdapter extends Adapter<LeaderOverviewGroup> {

  constructor(private leaderAdapter: LeaderAdapter) {
    super();
  }

  adapt(item: any): LeaderOverviewGroup {
    return new LeaderOverviewGroup(
      item.mCount,
      item.fCount,
      item.uCount,
      item.name,
      item.summaryMembersType,
      item.summaryLeadersType,
      item.color,
      this.leaderAdapter.adaptArray(item.leaders)
    );
  }

}
