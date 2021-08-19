
export interface Tab {
  tag: string;
  name?: string;
  className: string;
  config?: TabConfig;
}

export interface TabConfig {
  datePicker: {
    datePoint: boolean,
    dateRange: boolean,
  };
  dataLoader: () => Promise<any>;
}
