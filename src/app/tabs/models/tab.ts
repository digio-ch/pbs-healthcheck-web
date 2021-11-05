import {Type} from '@angular/core';
import {DataProviderService} from '../../shared/services/data-provider.service';

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
  dataProvider: Type<DataProviderService>;
}
