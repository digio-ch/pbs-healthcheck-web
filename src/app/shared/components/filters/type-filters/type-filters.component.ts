import { Component, OnInit } from '@angular/core';
import {DefaultFilterFacade} from '../../../../store/facade/default-filter.facade';
import {PeopleType} from '../../../models/people-type';
import {Observable} from 'rxjs';
import {GroupType} from '../../../models/group-type';
import {WidgetFacade} from '../../../../store/facade/widget.facade';
import {TypeFilter} from '../../../models/type-filter';
import {WidgetFilterComponent} from '../widget-filter/widget-filter.component';

@Component({
  selector: 'app-type-filters',
  templateUrl: './type-filters.component.html',
  styleUrls: ['./type-filters.component.scss']
})
export class TypeFiltersComponent extends WidgetFilterComponent implements OnInit {
  public static FILTER_CLASS_NAME = 'default-filter';

  groupTypes: GroupType[] = [];
  peopleTypes: PeopleType[] = [];
  loadingFilters$: Observable<boolean>;

  colors = [
    '#EEE09F', // Group::Biber
    '#3BB5DC', // Group::Woelfe
    '#9A7A54', // Group::Pfadi
    '#DD1F19', // Group::Pio
    '#1DA650', // Group::Roverstufe
    '#d9b826', // Group::Pta
    '#005716' // Leitende
  ];

  constructor(
    private filterFacade: DefaultFilterFacade,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadingFilters$ = this.filterFacade.isLoading$();
    this.filterFacade.getGroupTypes$().subscribe(groups => {
      this.groupTypes = groups;
    });
    this.filterFacade.getPeopleTypes$().subscribe(types => {
      this.peopleTypes = types;
    });
  }

  onTypeFilterChange(item: TypeFilter, newSelectionValue: boolean) {
    item.selected = newSelectionValue;
    this.filterFacade.forceUpdate();
  }

  shouldBeDisabled(items: TypeFilter[], item: TypeFilter) {
    return items.filter(itm => itm.selected).length === 1 && item.selected;
  }
}
