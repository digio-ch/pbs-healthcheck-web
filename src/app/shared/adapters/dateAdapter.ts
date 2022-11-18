import {Adapter} from './adapter';
import {Permission} from '../models/permission';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateAdapter extends Adapter<string> {
  adapt(date: string): string {
    if (!date) {
      return '';
    };
    const formattedDate = new Date(date).toLocaleDateString('de-DE');
    const daysToDate = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 *24));
    return `${formattedDate} (${daysToDate} Tage)`;
  }
}
