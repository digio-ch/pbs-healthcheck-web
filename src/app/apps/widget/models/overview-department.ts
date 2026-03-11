export interface OverviewDepartmentsRegion {
  name?: string
  children: OverviewDepartment[]
}

export interface OverviewDepartment {
  id: number
  name: string
  groupTypes: OverviewDepartmentGroupType[]
}

export interface OverviewDepartmentGroupType {
  name: string
  value: string
  color: string
}