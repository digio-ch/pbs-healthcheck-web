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
    public syncableGroups: Group[],
    public readableGroups: Group[]
  ) {
  }

  public getFullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  public canSyncGroup(groupId: number): boolean {
    return this.syncableGroups.some(group => group.id === groupId);
  }
}
