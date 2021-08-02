import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {FilterFacade} from "../../../store/facade/filter.facade";
import {WidgetFacade} from "../../../store/facade/widget.facade";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {
  filtersLoading$: Observable<boolean>;
  widgetsLoading$: Observable<boolean>;
  widgetDataError$: Observable<boolean>;

  latestDate = '?';
  filterDatesEmpty: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private filterFacade: FilterFacade,
    private widgetFacade: WidgetFacade,
  ) { }

  ngOnInit(): void {
    this.filtersLoading$ = this.filterFacade.isLoading$();
    this.widgetsLoading$ = this.widgetFacade.isLoading$();
    this.widgetDataError$ = this.widgetFacade.hasError$();
    this.subscriptions.push(this.filterFacade.getAvailableDates$().subscribe(dates => {
      if (!dates) {
        return;
      }
      if (dates.length > 0) {
        this.filterDatesEmpty = false;
        this.latestDate = dates[0].date.format('DD.MM.YYYY');
        return;
      }
      this.filterDatesEmpty = true;
      this.latestDate = '?';
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
