import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Widget} from '../../shared/models/widget';

@Injectable({
  providedIn: 'root'
})
export class WidgetState {

  private loading = new BehaviorSubject(false);
  private hasError = new BehaviorSubject(false);
  private widgetData = new BehaviorSubject<Widget[]>([
    new Widget('leader-overview', 'LeaderOverviewComponent', 1, 1, false, true),
    new Widget('members-gender', 'MembersGenderComponent', 1, 2, true, true),
    new Widget('members-group', 'MembersGroupComponent', 1, 2, true, true),
    new Widget('age-group-demographic', 'AgeGroupDemographicComponent', 2, 2, false, true),
    new Widget('camps', 'CampsComponent', 1, 2, true, false),
    new Widget('entered-left', 'MembersEnteredLeftComponent', 1, 2, true, false),
    new Widget('geo-location', 'GeoLocationComponent', 1, 2, false, true),
  ]);

  hasError$(): Observable<boolean> {
    return this.hasError.asObservable();
  }

  setError(error: boolean) {
    this.hasError.next(error);
  }

  isLoading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  isLoadingSnapshot(): boolean {
    return this.loading.value;
  }

  setLoading(loading: boolean) {
    this.loading.next(loading);
    if (loading) {
      this.hasError.next(false);
    }
  }

  getWidgetsSnapshot(): Widget[] {
    return this.widgetData.value;
  }

  getWidgetData$(): Observable<Widget[]> {
    return this.widgetData.asObservable();
  }

  setWidgetDataForKey(key: string, value: any) {
    const temp = this.widgetData.value;
    for (const w of temp) {
      if (w.uid === key ) {
        w.data = value;
      }
    }
    this.widgetData.next(temp);
  }
}
