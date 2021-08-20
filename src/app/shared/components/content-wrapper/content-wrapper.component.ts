import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FilterFacade} from '../../../store/facade/filter.facade';
import {DataFacade} from '../../../store/facade/data.facade';
import {DataProviderService} from '../../services/data-provider.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss']
})
export class ContentWrapperComponent implements OnInit, OnDestroy {

  @Input() dataHandler$: Observable<DataProviderService>;
  @Input() dataHandler: DataProviderService;

  setupLoading: boolean;
  dataLoading: boolean;
  dataError: boolean;

  subscriptions: Subscription[] = [];

  constructor(
    private filterFacade: FilterFacade,
    private dataFacade: DataFacade,
  ) { }

  ngOnInit(): void {
    this.filterFacade.isLoading$().pipe(
      take(1),
    ).subscribe(loading => {
      if (!loading) {
        this.filterFacade.forceUpdate();
      }
    });

    this.subscriptions.push(this.filterFacade.isLoading$().subscribe(loading => this.setupLoading = loading));

    this.subscriptions.push(this.dataFacade.isLoading$().subscribe(loading => this.dataLoading = loading));
    this.subscriptions.push(this.dataFacade.hasError$().subscribe(error => this.dataError = error));

    if (this.dataHandler$) {
      this.subscriptions.push(this.dataHandler$.subscribe(dataHandler => {
        if (!dataHandler) {
          return;
        }
        this.dataFacade.setHandler(dataHandler);
      }));
    } else if (this.dataHandler) {
      this.dataFacade.setHandler(this.dataHandler);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
