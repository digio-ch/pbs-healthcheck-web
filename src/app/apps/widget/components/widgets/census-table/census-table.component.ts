import { Component, OnInit } from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {WidgetTypeService} from '../../../services/widget-type.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-census-table',
  templateUrl: './census-table.component.html',
  styleUrls: ['./census-table.component.scss']
})
export class CensusTableComponent extends WidgetComponent implements OnInit {
  public static WIDGET_CLASS_NAME = 'CensusTableComponent';

  nameFilter = '';
  idFilter = [];
  exampleData = {
    years: [2017, 2018, 2019, 2020, 2021, 2022],
    data: [
      {
        id: 1,
        type: 1,
        name: 'Example Region 1',
        totalCount: [100, 110, 120, 130, 140, 150],
        averages: [3, -20, 40],
        children: [2, 3]
      },
      {
        id: 2,
        type: 2,
        name: 'Example Group 1',
        totalCount: [100, 110, 120, 130, 140, 150],
        averages: [3, -20, 40],
        children: [],
      },
      {
        id: 3,
        type: 2,
        name: 'Example Group 2',
        totalCount: [100, 110, 120, 130, 140, 150],
        averages: [3, -20, 40],
        children: [],
      },
      {
        id: 4,
        type: 1,
        name: 'Example Region 2',
        totalCount: [100, 110, 120, 130, 140, 150],
        averages: [3, -20, 40],
        children: [5]
      },
      {
        id: 5,
        type: 2,
        name: 'Example Group 3',
        totalCount: [100, 110, 120, 130, 140, 150],
        averages: [3, -20, 40],
        children: [],
      },
    ]
  };

  constructor(
    widgetTypeService: WidgetTypeService,
    private translateService: TranslateService
  ) {
    super(widgetTypeService, CensusTableComponent);
  }

  ngOnInit(): void {
  }

  getFilteredData() {
    return this.chartData.data.filter(group => group.name.toLowerCase().includes(this.nameFilter.toLowerCase())
      && !this.idFilter.find(v => v === group.id));
  }

  toggleRegion(id: number) {
    const children = this.chartData.data.filter(el => el.parentId === id).map(el => el.id);
    if (this.idFilter.find((el) => el === children[0])) {
      this.idFilter = this.idFilter.filter((filterId) => !children.includes(filterId));
    } else {
      this.idFilter.push(...this.chartData.data.filter(el => el.parentId === id).map(el => el.id));
    }
  }
}
