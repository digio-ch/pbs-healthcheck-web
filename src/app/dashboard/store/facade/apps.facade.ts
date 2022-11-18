import {AppsState} from '../state/apps.state';
import {Observable} from 'rxjs';
import {AppModel} from '../../../models/app.model';
import {Injectable} from '@angular/core';

@Injectable()
export class AppsFacade {
  constructor(
    private appsState: AppsState,
  ) {
  }

  public getApps$(): Observable<AppModel[]> {
    return this.appsState.getApps$();
  }
}
