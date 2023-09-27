import {Component, OnDestroy, OnInit} from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';
import {GroupFacade} from '../../../../../store/facade/group.facade';
import {FilterCheckBoxState} from './filter-checkbox/filter-checkbox.component';
import {CensusFilterService} from '../../../../../store/services/census-filter.service';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-census-table',
  templateUrl: './census-table.component.html',
  styleUrls: ['./census-table.component.scss']
})
export class CensusTableComponent extends WidgetComponent implements OnInit, OnDestroy {

  constructor(
    widgetTypeService: WidgetTypeService,
    private groupFacade: GroupFacade,
    private filterService: CensusFilterService,
    private translateService: TranslateService
  ) {
    super(widgetTypeService, CensusTableComponent);
  }

  public static WIDGET_CLASS_NAME = 'CensusTableComponent';

  private destroyed$ = new Subject();

  protected nameFilter = '';
  protected collapsedElements = [];
  protected data: any[];

  public currentGroup: string;

  protected readonly FilterCheckBoxState = FilterCheckBoxState;

  ngOnInit(): void {
    this.currentGroup = this.groupFacade.getCurrentGroupSnapshot().name;
    this.prepareData(this.filterService.getGroupFilterSnapshot());
    this.filterService.getGroupFilter$().pipe(
      takeUntil(this.destroyed$),
      tap(el => this.prepareData(el))
    ).subscribe();
  }

  get filteredData() {
    return this.data.filter(group => group.name.toLowerCase().includes(this.nameFilter.toLowerCase())
      && !this.collapsedElements.find(v => v === group.id));
  }

  prepareData(filterGroups) {
    this.data = this.chartData.data.map(el => ({
      collapsed: false,
      selected: filterGroups.find(id => id === el.id) ? FilterCheckBoxState.disabled : FilterCheckBoxState.enabled,
      ...el,
      relativeMemberCounts: el.relativeMemberCounts.map(value => value === null ? '-' : +value.toFixed(2))
    }));
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  toggleRegion(id: number) {
    const group = this.data.find(el => el.id === id);
    group.collapsed = !group.collapsed;
    const children = this.chartData.data.filter(el => el.parentId === id).map(el => el.id);
    if (this.collapsedElements.find((el) => el === children[0])) {
      this.collapsedElements = this.collapsedElements.filter((filterId) => !children.includes(filterId));
    } else {
      this.collapsedElements.push(...this.chartData.data.filter(el => el.parentId === id).map(el => el.id));
    }
  }

  updateGroupFilter(group) {
    const groupFilterCopy = this.filterService.getGroupFilterSnapshot();
    if (group.selected === FilterCheckBoxState.disabled) {
      this.filterService.setGroupFilter(groupFilterCopy.filter(id => id !== group.id));
    } else {
      this.filterService.setGroupFilter([...groupFilterCopy, group.id]);
    }
  }
}
