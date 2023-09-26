import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';
import {GroupService} from '../../../../../store/services/group.service';
import {GroupFacade} from '../../../../../store/facade/group.facade';
import {FilterCheckBoxState} from './filter-checkbox/filter-checkbox.component';

@Component({
  selector: 'app-census-table',
  templateUrl: './census-table.component.html',
  styleUrls: ['./census-table.component.scss']
})
export class CensusTableComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CensusTableComponent';

  nameFilter = '';
  collapsedElements = [];
  exampleData = {
    years: [2017, 2018, 2019, 2020, 2021, 2022],
    data: [
    ]
  };
  data: any[];

  public currentGroup: string;

  constructor(
    widgetTypeService: WidgetTypeService,
    private groupFacade: GroupFacade,
    private translateService: TranslateService
  ) {
    super(widgetTypeService, CensusTableComponent);
  }

  ngOnInit(): void {
    console.log(this.chartData);
    this.currentGroup = this.groupFacade.getCurrentGroupSnapshot().name;
    this.prepareData();
  }

  getFilteredData() {
    return this.data.filter(group => group.name.toLowerCase().includes(this.nameFilter.toLowerCase())
      && !this.collapsedElements.find(v => v === group.id));
  }

  prepareData() {
    this.data = this.chartData.data.map(el => ({...el, collapsed: false}));
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

  protected readonly FilterCheckBoxState = FilterCheckBoxState;
}
