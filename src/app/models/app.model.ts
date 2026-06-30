
export interface AppModel {
  key: AppKey;
  path: string;
  groupTypes: string[];
  requiredPermission?: string[];
}

export type AppKey = 
  'overview' | 
  'overview-departments' |
  'quap' | 
  'quap-departments' | 
  'census' |
  'my-organization';
