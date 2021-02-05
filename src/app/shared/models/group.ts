import {GroupType} from './group-type';

export class Group {
  constructor(
    public id: number,
    public name: string,
    public cantonName: string,
    public createdAt: string,
    public deletedAt: string,
    public groupType: GroupType
  ) { }
}
