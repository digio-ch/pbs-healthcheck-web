import {Adapter} from './adapter';
import {FilterData} from '../models/filter-data';
import {GroupAdapter} from './group.adapter';
import {Injectable} from '@angular/core';
import {GroupTypeAdapter} from './group-type.adapter';
import {FilterDateAdapter} from './filter-date.adapter';

@Injectable({
  providedIn: 'root'
})
export class FilterDataAdapter extends Adapter<FilterData> {
  constructor(
    private filterDateAdapter: FilterDateAdapter,
    private groupAdapter: GroupAdapter,
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
