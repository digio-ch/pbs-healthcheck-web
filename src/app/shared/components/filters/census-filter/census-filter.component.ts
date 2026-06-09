import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CensusFilterService, RolesType } from '../../../../store/services/census-filter.service';

@Component({
    selector: 'app-census-filter',
    templateUrl: './census-filter.component.html',
    styleUrls: ['./census-filter.component.scss'],
    standalone: false
})
export class CensusFilterComponent implements OnInit, OnDestroy {
  public static FILTER_CLASS_NAME = 'census-filter';

  private destroyed$ = new Subject();

  protected roles: RolesType[];
  protected filterMale: boolean;
  protected filterFemale: boolean;


  constructor(
    private censusFilter: CensusFilterService
  ) { }

  ngOnInit(): void {
    this.censusFilter.getRoleFilter$()
      .pipe(
        tap(roles => this.roles = roles),
        takeUntil(this.destroyed$)
      ).subscribe();
    this.censusFilter.getFilterMales$()
      .pipe(
        tap(v => this.filterMale = v),
        takeUntil(this.destroyed$)
      ).subscribe();
    this.censusFilter.getFilterFemales$()
      .pipe(
        tap(v => this.filterFemale = v),
        takeUntil(this.destroyed$)
      ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onRoleFilterChange(element, newState) {
    const rolesCopy = this.censusFilter.getRoleFilterSnapshot();
    rolesCopy.find(el => el.value === element.value).selected = newState;
    this.censusFilter.setRoleFilter(rolesCopy);
  }

  get initialized() {
    return this.censusFilter.isInitialized();
  }

  toggleM() {
    this.censusFilter.setFilterMale(!this.filterMale);
  }

  toggleF() {
    this.censusFilter.setFilterFemales(!this.filterFemale);
  }
}
