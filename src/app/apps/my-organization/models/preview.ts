export interface Preview {
  departments: string[],
  groupTypes: GroupType[]
};

export interface GroupType {
  name: string,
  color: string,
  value: number
}