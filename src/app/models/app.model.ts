
export interface AppModel {
  key: AppKey;
  translationKey: string;
  path: string;
  groupTypes: string[];
  requiredPermission?: string[];
}

export type AppKey = 
  'overview' | 
  'overview-departments' |
  'quap' | 
  'quap-departments' | 
  'census' ;
