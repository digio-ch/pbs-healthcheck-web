import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {DefaultFilterFacade} from '../../../store/facade/default-filter.facade';
import {WidgetFacade} from '../../../store/facade/widget.facade';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {
  filtersLoading$: Observable<boolean>;
  widgetsLoading$: Observable<boolean>;
  widgetDataError$: Observable<boolean>;

  filterDatesEmpty: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private filterFacade: DefaultFilterFacade,
    private widgetFacade: WidgetFacade,
  ) { }

  ngOnInit(): void {
    this.filtersLoading$ = this.filterFacade.isLoading$();
    this.widgetsLoading$ = this.widgetFacade.isLoading$();
    this.widgetDataError$ = this.widgetFacade.hasError$();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
