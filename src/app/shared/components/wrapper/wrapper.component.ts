import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Person} from '../../models/person';
import {AppFacade} from '../../../store/facade/app.facade';
import {FilterFacade} from '../../../store/facade/filter.facade';
import {GroupFacade} from '../../../store/facade/group.facade';
import {BreadcrumbService} from '../../services/breadcrumb.service';
import {DateFacade} from '../../../store/facade/date.facade';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit, OnDestroy {
  person: Person;

  latestDate = '?';
  filterLoading: boolean;
  filterDatesEmpty: boolean;

  private destroyed$ = new Subject();

  constructor(
    private appFacade: AppFacade,
    private filterFacade: FilterFacade,
    private groupFacade: GroupFacade,
    private dateFacade: DateFacade,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.pushBreadcrumb({
      name: 'Dashboard',
      path: '/',
    });

    this.appFacade.getPerson$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(person => this.person = person);

    this.groupFacade.getCurrentGroup$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(group => this.dateFacade.loadFilterData(group));

    this.dateFacade.getAvailableDates$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(dates => {
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
    });

    this.dateFacade.isLoading$().pipe(
      takeUntil(this.destroyed$),
    ).subscribe(loading => this.filterLoading = loading);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get loading(): boolean {
    return this.filterLoading;
  }
}
