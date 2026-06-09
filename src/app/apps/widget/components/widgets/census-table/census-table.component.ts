import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { GroupFacade } from '../../../../../store/facade/group.facade';
import { CensusFilterService } from '../../../../../store/services/census-filter.service';
import { CensusCsvService } from '../../../services/census-csv.service';
import { WidgetTypeService } from '../../../services/widget-type.service';
import { WidgetComponent } from '../widget/widget.component';
import { FilterCheckBoxState, FilterCheckboxComponent } from './filter-checkbox/filter-checkbox.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgStyle, NgClass } from '@angular/common';
import { InfoComponent } from '../../../../../shared/components/info/info.component';
import { TableCollapseButtonComponent } from './table-collapse-button/table-collapse-button.component';
import { StatisticsCellComponent } from './statistics-cell/statistics-cell.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-census-table',
    templateUrl: './census-table.component.html',
    styleUrls: ['./census-table.component.scss'],
    imports: [MatIconButton, MatIcon, FilterCheckboxComponent, MatFormField, MatLabel, MatInput, FormsModule, MatSuffix, InfoComponent, NgStyle, NgClass, TableCollapseButtonComponent, StatisticsCellComponent, TranslatePipe]
})
export class CensusTableComponent extends WidgetComponent implements OnInit, OnDestroy {
  public static WIDGET_CLASS_NAME = 'CensusTableComponent';
  protected readonly FilterCheckBoxState = FilterCheckBoxState;
  private destroyed$ = new Subject();

  constructor(
    widgetTypeService: WidgetTypeService,
    private groupFacade: GroupFacade,
    private filterService: CensusFilterService,
    private csvDownloader: CensusCsvService
  ) {
    super(widgetTypeService, CensusTableComponent);
  }

  protected nameFilter = '';
  protected collapsedElements = [];
  protected data: any[];
  protected sixYearsAgo = new Date().getFullYear() - 5;

  public currentGroupId: number;

  ngOnInit(): void {
    this.currentGroupId = this.groupFacade.getCurrentGroupSnapshot().id;
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

  get selectAllIcon() {
    if (this.filterService.getGroupFilterSnapshot().length === 0) {
      return FilterCheckBoxState.enabled;
    } else if (this.chartData.data.length === this.filterService.getGroupFilterSnapshot().length) {
      return FilterCheckBoxState.disabled;
    } else {
      return FilterCheckBoxState.mixed;
    }
  }

  prepareData(filterGroups) {
    this.data = this.chartData.data.map(el => ({
      collapsed: false,
      selected: filterGroups.find(id => id === el.id) ? FilterCheckBoxState.disabled : FilterCheckBoxState.enabled,
      ...el,
      relativeMemberCounts: el.relativeMemberCounts.map(value => value === null ? '-' : Math.round(value))
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

  toggleSelectAll() {
    if (this.selectAllIcon !== FilterCheckBoxState.disabled) {
      this.filterService.setGroupFilter(this.data.map(el => el.id));
    } else {
      this.filterService.setGroupFilter([]);
    }
  }

  downloadCSV() {
    this.csvDownloader.downloadCsv(this.chartData.years, this.data);
  }
}
