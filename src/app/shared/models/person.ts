import {Role} from './role';
import {Group} from './group';

export class Person {
  constructor(
    public id: number,
    public email: string,
    public firstName: string,
    public lastName: string,
    public nickName: string,
    public birthday: string,
    public address: string,
    public zipCode: string,
    public town: string,
    public country: string,
    public correspondenceLanguage: string,
    public gender: string,
    public personRoles: Role[],
    public groups: Group[]
  ) {
  }

  public getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  public hasRoleInGroup(groupId: number, roleTypes: string[]): boolean {
    for (const personRole of this.personRoles) {
      if (!roleTypes.includes(personRole.roleType)) {
        continue;
      }
      if (personRole.groupId !== groupId) {
        continue;
      }
      return true;
    }
    return false;
  }
}
