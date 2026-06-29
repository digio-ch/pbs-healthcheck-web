import { AppsState } from '../state/apps.state';
import { Observable } from 'rxjs';
import { AppModel } from '../../../models/app.model';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class AppsFacade {
  private appsState = inject(AppsState);


  public getApps$(): Observable<AppModel[]> {
    return this.appsState.getApps$();
  }
}
