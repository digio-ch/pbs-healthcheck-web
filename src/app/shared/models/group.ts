import {GroupType} from './group-type';

export class Group {
  public static GROUP_TYPE_DEPARTMENT = 7;
  public static GROUP_TYPE_CANTON = 2;
  public static GROUP_TYPE_FEDERATION = 1;

  constructor(
    public id: number,
    public name: string,
    public cantonName: string,
    public createdAt: string,
    public deletedAt: string,
    public groupType: GroupType
  ) { }

  isDepartment(): boolean {
    return this.groupType.id === 7;
  }
}
