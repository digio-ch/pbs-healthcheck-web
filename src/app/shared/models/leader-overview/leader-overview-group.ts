import {Leader} from './leader';

export class LeaderOverviewGroup {
  constructor(
    public mCount: number,
    public fCount: number,
    public uCount: number,
    public name: string,
    public summaryMembersType: string,
    public summaryLeadersType: string,
    public color: string,
    public leaders: Leader[] = [],
    public empty: boolean = false,
    public height = 1,
  ) {
    this.empty = this.getTotalCount() === 0 && this.getTotalCount() === 0;
  }

  getMemberCount(): number {
    return this.fCount + this.mCount + this.uCount;
  }

  getTotalCount(): number {
    return this.fCount + this.mCount + this.uCount + this.leaders.length;
  }

  getRatio(): string {
    if (this.leaders.length === 0 || this.getMemberCount() === 0) {
      return '';
    }
    return '1:' + Math.round(this.getMemberCount() / this.leaders.length).toString(10);
  }
}
