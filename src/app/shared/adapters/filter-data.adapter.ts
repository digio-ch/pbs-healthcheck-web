import { Injectable, inject } from '@angular/core';
import { FilterData } from '../models/filter-data';
import { Adapter } from './adapter';
import { FilterDateAdapter } from './filter-date.adapter';
import { GroupTypeAdapter } from './group-type.adapter';

@Injectable({
  providedIn: 'root'
})
export class FilterDataAdapter extends Adapter<FilterData> {
  private filterDateAdapter = inject(FilterDateAdapter);
  private groupTypeAdapter = inject(GroupTypeAdapter);

  adapt(item: any): FilterData {
    return {
      dates: this.filterDateAdapter.adaptArray(item.dates),
      groupTypes: this.groupTypeAdapter.adaptArray(item.groupTypes)
    }
  }
}
