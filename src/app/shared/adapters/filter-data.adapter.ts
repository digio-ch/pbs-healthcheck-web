import { Injectable } from '@angular/core';
import { FilterData } from '../models/filter-data';
import { Adapter } from './adapter';
import { FilterDateAdapter } from './filter-date.adapter';
import { GroupTypeAdapter } from './group-type.adapter';

@Injectable({
  providedIn: 'root'
})
export class FilterDataAdapter extends Adapter<FilterData> {
  constructor(
    private filterDateAdapter: FilterDateAdapter,
    private groupTypeAdapter: GroupTypeAdapter
  ) {
    super();
  }
  adapt(item: any): FilterData {
    return new FilterData(
      this.filterDateAdapter.adaptArray(item.dates),
      this.groupTypeAdapter.adaptArray(item.groupTypes)
    );
  }
}
