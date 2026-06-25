import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Widget } from '../../shared/models/widget';
import { PageType } from 'src/app/apps/widget/services/widget-type.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetState {
  /* 
  * TODO: Improvements
  * - convert Widget class to interface
  * - use property "capabilites" where one can add "RANGE" and "DATE" for better readability
  * - check if we can specify the component instead of a string
  * - convert to a map groupType -> widgets
  */

  overviewWidgets = [
    new Widget('leader-overview', 'LeaderOverviewComponent', false, true),
    new Widget('members-gender', 'MembersGenderComponent', true, true),
    new Widget('members-group', 'MembersGroupComponent', true, true),
    new Widget('age-group-demographic', 'AgeGroupDemographicComponent', false, true),
    new Widget('camps', 'CampsComponent', true, false),
    new Widget('entered-left', 'MembersEnteredLeftComponent', true, false),
    new Widget('geo-location', 'GeoLocationComponent', false, true),
    new Widget('role-overview', 'RoleOverviewComponent', true, false),
  ];

  myOrganizationWidgets = [
    new Widget('gender-stats', 'MembersGenderComponent', true, true),
    new Widget('stage-stats', 'MembersGroupComponent', true, true),
    new Widget('demographic-stats', 'AgeGroupDemographicComponent', false, true),
  ];

  censusWidgets = [
    new Widget('census-table', 'CensusTableComponent', false, true),
    new Widget('census-development', 'CensusDevelopmentComponent', false, true),
    new Widget('census-members', 'CensusMembersComponent', false, true),
    new Widget('census-treemap', 'CensusTreemapComponent', false, true),
  ];

  private loading = new BehaviorSubject(true);
  private hasError = new BehaviorSubject(false);
  private widgetData = new BehaviorSubject<any>(null);
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

  getWidgets(pageType: PageType): Widget[] {
    switch(pageType) {
      case 'overview':
      case 'overview-department':
        return this.overviewWidgets;
      case 'census':
        return this.censusWidgets;
      case 'my-organization':
        return this.myOrganizationWidgets;
    }
  }

  getWidgetData$(): Observable<any> {
    return this.widgetData.pipe(
      filter(data => !!data)
    )
  }

  setWidgetData(data: any): void {
    this.widgetData.next(data);
  }
}
