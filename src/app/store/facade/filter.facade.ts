import {Injectable} from '@angular/core';
import {FilterState} from '../state/filter.state';
import {FilterService} from '../services/filter.service';
import {take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {WidgetFacade} from './widget.facade';
import {PeopleType} from '../../shared/models/people-type';
import {GroupType} from '../../shared/models/group-type';
import {FilterDate} from '../../shared/models/date-selection/filter-date';
import {DateSelection} from '../../shared/models/date-selection/date-selection';
import {DateQuickSelectionOptions} from '../../shared/models/date-selection/date-quick-selection-options';
import {Group} from '../../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class FilterFacade {

  constructor(
    private filterState: FilterState,
    private filterService: FilterService,
    private widgetFacade: WidgetFacade
  ) {}

  isLoading$(): Observable<boolean> {
    return this.filterState.isLoading$();
  }

  loadFilterData(group: Group) {
    this.filterState.setLoading(true);
    this.filterService.getFilterData(group).pipe(take(1)).subscribe(
      filterData => {
        if (filterData.dates.length === 0) {
          return;
        }
        this.filterState.setAvailableDates(filterData.dates);
        this.filterState.setGroupTypes(filterData.groupTypes);
        // set date to today as default
        this.filterState.setDateSelection(new DateSelection(
          filterData.dates[0].date,
          null,
          false
        ));
        this.widgetFacade.loadDataForWidgets();
      },
      error => console.log(error),
      () => this.filterState.setLoading(false)
    );
  }

  setDateSelection(dateSelection: DateSelection) {
      if (this.widgetFacade.isLoadingSnapshot()) {
        return;
      }
      this.filterState.setDateSelection(dateSelection);
      this.widgetFacade.loadDataForWidgets();
  }

  getDateSelectionSnapshot(): DateSelection {
    return this.filterState.getDateSelectionSnapshot();
  }

  getDateSelection$(): Observable<DateSelection> {
    return this.filterState.getDateSelection$();
  }

  getAvailableDates$(): Observable<FilterDate[]> {
    return this.filterState.getAvailableDates$();
  }

  getAvailableDateQuickSelectionOptions$(): Observable<DateQuickSelectionOptions> {
    return this.filterState.getDateQuickSelectionOptions$();
  }

  getAvailableDateQuickSelectionOptionsSnapshot(): DateQuickSelectionOptions {
    return this.filterState.getDateQuickSelectionOptionsSnapshot();
  }

  getGroupTypes$(): Observable<GroupType[]> {
    return this.filterState.getGroupTypes$();
  }

  getPeopleTypes$(): Observable<PeopleType[]> {
    return this.filterState.getPeopleTypes$();
  }
}
