import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {FilterFacade} from '../../../store/facade/filter.facade';
import {DataFacade} from '../../../store/facade/data.facade';
import {DataProviderService} from '../../services/data-provider.service';
import {take, takeUntil} from 'rxjs/operators';

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

  private destroyed$ = new Subject();

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

    this.filterFacade.isLoading$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(loading => this.setupLoading = loading);

    this.dataFacade.isLoading$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(loading => this.dataLoading = loading);
    this.dataFacade.hasError$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(error => this.dataError = error);

    if (this.dataHandler$) {
      this.dataHandler$.pipe(
        takeUntil(this.destroyed$),
      ).subscribe(dataHandler => {
        if (!dataHandler) {
          return;
        }
        this.dataFacade.setHandler(dataHandler);
      });
    } else if (this.dataHandler) {
      this.dataFacade.setHandler(this.dataHandler);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
