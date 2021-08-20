import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Person} from "../../models/person";
import {AppFacade} from "../../../store/facade/app.facade";
import {FilterFacade} from '../../../store/facade/filter.facade';
import {GroupFacade} from '../../../store/facade/group.facade';

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

  subscriptions: Subscription[] = [];

  constructor(
    private appFacade: AppFacade,
    private filterFacade: FilterFacade,
    private groupFacade: GroupFacade,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(this.appFacade.getPerson$().subscribe(person => this.person = person));

    this.subscriptions.push(this.groupFacade.getCurrentGroup$().subscribe(group => this.filterFacade.loadFilterData(group)));

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

    this.subscriptions.push(this.filterFacade.isLoading$().subscribe(loading => this.filterLoading = loading));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
