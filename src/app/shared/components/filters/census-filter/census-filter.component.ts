import {Component, OnDestroy, OnInit} from '@angular/core';
import {CensusService} from '../../../../store/services/census.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-census-filter',
  templateUrl: './census-filter.component.html',
  styleUrls: ['./census-filter.component.scss']
})
export class CensusFilterComponent implements OnInit, OnDestroy {
  public static FILTER_CLASS_NAME = 'census-filter';

  private destroyed$ = new Subject();

  // TODO: Insert filter logic

  public peopleTypes = [
    {
      label: 'biber',
      color: '#EEE09F',
    },
    {
      label: 'woelfe',
      color: '#3BB5DC',
    },
    {
      label: 'pfadis',
      color: '#9A7A54',
    },
    {
      label: 'rover',
      color: '#1DA650',
    },
    {
      label: 'pio',
      color: '#DD1F19',
    },
    {
      label: 'pta',
      color: '#d9b826',
    },
    {
      label: 'leiter',
      color: '#929292',
    },
  ];

  constructor(
    private censusService: CensusService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
