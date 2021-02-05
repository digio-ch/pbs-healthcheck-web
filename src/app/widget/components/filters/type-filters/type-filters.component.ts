import { Component, OnInit } from '@angular/core';
import {FilterFacade} from '../../../../store/facade/filter.facade';
import {PeopleType} from '../../../../shared/models/people-type';
import {Observable} from 'rxjs';
import {GroupType} from '../../../../shared/models/group-type';
import {WidgetFacade} from '../../../../store/facade/widget.facade';
import {TypeFilter} from '../../../../shared/models/type-filter';

@Component({
  selector: 'app-type-filters',
  templateUrl: './type-filters.component.html',
  styleUrls: ['./type-filters.component.scss']
})
export class TypeFiltersComponent implements OnInit {

  groupTypes: GroupType[] = [];
  peopleTypes: PeopleType[] = [];
  loadingFilters$: Observable<boolean>;
  isLoadingData: boolean;

  colors = [
    '#EEE09F', // Group::Biber
    '#3BB5DC', // Group::Woelfe
    '#9A7A54', // Group::Pfadi
    '#DD1F19', // Group::Pio
    '#1DA650', // Group::Roverstufe
    '#d9b826', // Group::Pta
    '#929292' // Leitende
  ];

  constructor(
    private filterFacade: FilterFacade,
    private widgetFacade: WidgetFacade
  ) { }

  ngOnInit(): void {
    this.loadingFilters$ = this.filterFacade.isLoading$();
    this.widgetFacade.isLoading$().subscribe(loading => {
      this.isLoadingData = loading;
      this.peopleTypes.forEach(i => i.disabled = loading);
      this.groupTypes.forEach(i => i.disabled = loading);
    });
    this.filterFacade.getGroupTypes$().subscribe(groups => {
      this.groupTypes = groups;
    });
    this.filterFacade.getPeopleTypes$().subscribe(types => {
      this.peopleTypes = types;
    });
  }

  onTypeFilterChange(item: TypeFilter, newSelectionValue: boolean) {
    item.selected = newSelectionValue;
    this.widgetFacade.loadDataForWidgets();
  }

  shouldBeDisabled(items: TypeFilter[], item: TypeFilter) {
    return items.filter(itm => itm.selected).length === 1 && item.selected;
  }
}
