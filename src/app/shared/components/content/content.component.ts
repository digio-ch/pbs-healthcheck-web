import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DefaultFilterFacade } from '../../../store/facade/default-filter.facade';
import { WidgetFacade } from '../../../store/facade/widget.facade';
import { AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    imports: [LoadingComponent, TranslatePipe, AsyncPipe]
})
export class ContentComponent implements OnInit, OnDestroy {
  private filterFacade = inject(DefaultFilterFacade);
  private widgetFacade = inject(WidgetFacade);

  filtersLoading$: Observable<boolean>;
  widgetsLoading$: Observable<boolean>;
  widgetDataError$: Observable<boolean>;

  filterDatesEmpty: boolean;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.filtersLoading$ = this.filterFacade.isLoading$();
    this.widgetsLoading$ = this.widgetFacade.isLoading$();
    this.widgetDataError$ = this.widgetFacade.hasError$();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
