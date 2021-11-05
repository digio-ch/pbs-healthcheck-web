import {DateSelection} from '../models/date-selection/date-selection';
import {Group} from '../models/group';
import {BehaviorSubject, Observable} from 'rxjs';

export abstract class DataProviderService {
  private data: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  abstract refreshData(dateSelection: DateSelection, group: Group, peopleTypes: string[], groupTypes: string[]): Promise<boolean>;

  protected setData(data: any): void {
    this.data.next(data);
  }

  public getData$(): Observable<any> {
    return this.data.asObservable();
  }
}
