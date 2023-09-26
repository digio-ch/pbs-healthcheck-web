import {Component, OnDestroy, OnInit} from '@angular/core';
import {CensusService} from '../../../../store/services/census.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CensusFilterService} from '../../../../store/services/census-filter.service';
import {TypeFilter} from '../../../models/type-filter';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-census-filter',
  templateUrl: './census-filter.component.html',
  styleUrls: ['./census-filter.component.scss']
})
export class CensusFilterComponent implements OnInit, OnDestroy {
  public static FILTER_CLASS_NAME = 'census-filter';

  private destroyed$ = new Subject();

  public roles$: Observable<{ color: string, value: string, selected: boolean }[]>;


  constructor(
    private censusService: CensusService,
    private censusFilter: CensusFilterService
  ) { }

  ngOnInit(): void {
    this.roles$ = this.censusFilter.getRoleFilter$().pipe(tap((roles) => console.log("Roles updated", JSON.stringify(roles))));
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onRoleFilterChange(element, newState) {
    const rolesCopy = JSON.parse(JSON.stringify(this.censusFilter.getRoleFilterSnapshot()));
    for (let i = 0; i < rolesCopy.length; i++) {
      if (rolesCopy[i].value === element.value) {
        console.log(rolesCopy[i]);
        rolesCopy[i].selected = !rolesCopy[i].selected;
        console.log(rolesCopy[i]);
      }
    }
    console.log(rolesCopy);
    this.censusFilter.setRoleFilter(rolesCopy);
  }


}
