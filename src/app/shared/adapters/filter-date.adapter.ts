import {Adapter} from './adapter';
import {FilterDate} from '../models/date-selection/filter-date';
import * as moment from 'moment';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterDateAdapter extends Adapter<FilterDate> {
  adapt(item: any): FilterDate {
    return new FilterDate(moment(item));
  }
}
