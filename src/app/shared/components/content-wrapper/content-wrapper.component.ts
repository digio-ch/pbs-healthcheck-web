import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {FilterFacade} from '../../../store/facade/filter.facade';
import {DateSelection} from '../../models/date-selection/date-selection';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss']
})
export class ContentWrapperComponent implements OnInit, OnDestroy {

  @Output() loadData = new EventEmitter<DateSelection>();
  @Input() updateData: Observable<any>;
  @Input() loadingStatus: Observable<{ data: any, error: any }>;

  setupLoading: boolean;
  dataLoading: boolean;
  dataError: boolean;

  subscriptions: Subscription[] = [];

  constructor(
    private filterFacade: FilterFacade,
  ) { }

  ngOnInit(): void {
    const update = combineLatest([this.filterFacade.getDateSelection$(), this.updateData]).pipe(
      map(data => {
        return data[0];
      }),
    );

    this.subscriptions.push(update.subscribe(dateSelection => {
      if (dateSelection) {
        this.dataLoading = true;
        this.loadData.emit(dateSelection);
      }
    }));

    this.subscriptions.push(this.loadingStatus.subscribe(status => {
      this.dataLoading = false;
      if (status.error) {
        this.dataError = true;
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
