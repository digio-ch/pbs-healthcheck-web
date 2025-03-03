import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Widget} from '../../shared/models/widget';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WidgetState {

  defaultWidgets = [
    new Widget('leader-overview', 'LeaderOverviewComponent', 1, 1, false, true),
    new Widget('members-gender', 'MembersGenderComponent', 1, 2, true, true),
    new Widget('members-group', 'MembersGroupComponent', 1, 2, true, true),
    new Widget('age-group-demographic', 'AgeGroupDemographicComponent', 2, 2, false, true),
    new Widget('camps', 'CampsComponent', 1, 2, true, false),
    new Widget('entered-left', 'MembersEnteredLeftComponent', 1, 2, true, false),
    new Widget('geo-location', 'GeoLocationComponent', 1, 2, false, true),
    new Widget('role-overview', 'RoleOverviewComponent', 1, 2, true, false),
  ];

  censusWidgets = [
    new Widget('census-table', 'CensusTableComponent', 2, 2, false, true),
    new Widget('census-development', 'CensusDevelopmentComponent', 2, 2, false, true),
    new Widget('census-members', 'CensusMembersComponent', 2, 2, false, true),
    new Widget('census-treemap', 'CensusTreemapComponent', 2, 2, false, true),
  ];

  private loading = new BehaviorSubject(false);
  private hasError = new BehaviorSubject(false);
  private widgets = new BehaviorSubject<Widget[]>([]);
  private widgetData = new BehaviorSubject<any>([]);

  constructor(
    private router: Router
  ) {}
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
    const widgetPath = this.router.url.split('/').slice(-1)[0];
    if (widgetPath === 'census') {
      return this.censusWidgets;
    }
    return this.defaultWidgets;
  }

  getWidgets$(): Observable<Widget[]> {
    const widgetPath = this.router.url.split('/').slice(-1)[0];
    if (widgetPath === 'census') {
      this.widgets.next(this.censusWidgets);
    } else {
      this.widgets.next(this.defaultWidgets);
    }
    return this.widgets.asObservable();
  }

  setWidgets(widgets: Widget[]) {
    this.widgets.next(widgets);
  }

  getWidgetData$(): Observable<any> {
    return this.widgetData.asObservable();
  }

  setWidgetData(data: any): void {
    this.widgetData.next(data);
  }
}
