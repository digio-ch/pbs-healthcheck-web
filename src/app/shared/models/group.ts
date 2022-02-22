import {GroupType} from './group-type';

export class Group {
  public static GROUP_TYPE_DEPARTMENT = 7;
  public static GROUP_TYPE_REGION = 3;
  public static GROUP_TYPE_CANTON = 2;
  public static GROUP_TYPE_FEDERATION = 1;

  public static PERMISSION_TYPE_OWNER = 'owner';

  constructor(
    public id: number,
    public name: string,
    public cantonName: string,
    public createdAt: string,
    public deletedAt: string,
    public permissionType: string,
    public groupType: GroupType
  ) { }

  isDepartment(): boolean {
    return this.groupType.id === 7;
  }
}
