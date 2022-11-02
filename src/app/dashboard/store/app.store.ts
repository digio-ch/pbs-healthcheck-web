import {BehaviorSubject, Observable} from 'rxjs';
import {AppModel} from '../../models/app.model';
import {Injectable} from '@angular/core';

@Injectable()
export class AppStore {
  private apps = new BehaviorSubject<AppModel[]>([
    {
      name: 'overview',
      translationKey: 'overview',
      path: 'widgets',
    },
    {
      name: 'quap',
      translationKey: 'quap',
      path: 'quap',
    },
    {
      name: 'quap-departments',
      translationKey: 'quap-departments',
      path: 'quap',
    },
  ]);

  public getApps$(): Observable<AppModel[]> {
    return this.apps.asObservable();
  }
}
