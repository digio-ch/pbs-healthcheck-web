import {Adapter} from './adapter';
import {DateModel} from '../models/date-selection/date.model';
import * as moment from 'moment';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterDateAdapter extends Adapter<DateModel> {
  adapt(item: any): DateModel {
    return new DateModel(moment(item));
  }
}
