import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, first, map, tap } from 'rxjs/operators';
import { Group } from '../../shared/models/group';
import { CensusService } from './census.service';
import { ApiService } from '../../shared/services/api.service';
import { GroupFacade } from '../facade/group.facade';
import { HttpParams } from '@angular/common/http';
import { Loadable } from 'src/app/shared/models/loadable';

@Injectable({
  providedIn: 'root'
})
export class CensusFilterService implements Loadable {
  private censusService = inject(CensusService);
  private apiService = inject(ApiService);
  private groupFacade = inject(GroupFacade);

  private roleFilter = new BehaviorSubject([
    {
      value: 'biber',
      color: '#EEE09F',
      selected: false,
    },
    {
      value: 'woelfe',
      color: '#3BB5DC',
      selected: true,
    },
    {
      value: 'pfadis',
      color: '#9A7A54',
      selected: true,
    },
    {
      value: 'rover',
      color: '#1DA650',
      selected: true,
    },
    {
      value: 'pio',
      color: '#DD1F19',
      selected: true,
    },
    {
      value: 'pta',
      color: '#d9b826',
      selected: false,
    },
    {
      value: 'leiter',
      color: '#005716',
      selected: true,
    },
  ]);
  private groupFilter: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private filterMales: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private filterFemales: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public loadFilterData(group: Group) {
    this.isLoading.next(true);

    return this.censusService.getFilter(group.id).pipe(
      first(),
      tap(filterData => {
        this.filterMales.next(filterData.filterMales);
        this.filterFemales.next(filterData.filterFemales);

        const roleCopy = this.roleFilter.getValue();
        roleCopy.map(el => {
          el.selected = !filterData.roles.find(role => role === el.value);
          return el;
        });
        this.roleFilter.next(roleCopy);
       this.groupFilter.next(filterData.groups.map(el => parseInt(el, 10)));
        this.isLoading.next(false);
      }),
      catchError(err => {
        return of(err);
      })
    );
  }

  public isLoading$(): Observable<boolean> {
    return this.isLoading.pipe(
      distinctUntilChanged(),
    )
  }

  public getFilterState$(): Observable<CensusFilterState> {
    return combineLatest([
      this.groupFilter.asObservable(),
      this.roleFilter.asObservable(),
      this.filterFemales.asObservable(),
      this.filterMales.asObservable(),
      this.isLoading$()
    ]).pipe(
      filter(([_,__,___,____,loading]) => !loading),
      map(([groups, roles, filterFemales, filterMales]) => ({
        groups,
        roles,
        filterFemales,
        filterMales
      }))
    );
  }

  public getFilterMales$() {
    return this.filterMales.asObservable();
  }

  public getFilterFemales$() {
    return this.filterFemales.asObservable();
  }

  public updateFilter(censusFilterState: CensusFilterState) {
    let params = new HttpParams();
    params = this.mapCensusFilterToHTTPParams(censusFilterState, params);
    return this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/census/filter`, {}, {params})
  }

  public mapCensusFilterToHTTPParams(censusFilterState: CensusFilterState, params: HttpParams) {
    const filteredRoles = censusFilterState.roles.filter(el => el.selected === false).map(el => el.value);
    filteredRoles.forEach(item => {
      params = params.append('census-filter-roles[]', item);
    });
    censusFilterState.groups.forEach(item => {
      params = params.append('census-filter-departments[]', item);
    });
    params = params.append('census-filter-females', censusFilterState.filterFemales);
    params = params.append('census-filter-males', censusFilterState.filterMales);
    return params;
  }

  public getRoleFilter$() {
    return this.roleFilter.asObservable();
  }

  public getRoleFilterSnapshot() {
    return this.roleFilter.getValue();
  }

  public setRoleFilter(nextValue) {
    this.roleFilter.next(nextValue);
  }

  public getGroupFilter$() {
    return this.groupFilter.asObservable();
  }

  public getGroupFilterSnapshot() {
    return this.groupFilter.getValue();
  }

  public setGroupFilter(nextValue) {
    this.groupFilter.next(nextValue);
  }

  public setFilterMale(nextValue) {
    this.filterMales.next(nextValue);
  }

  public setFilterFemales(nextvalue) {
    this.filterFemales.next(nextvalue);
  }
}

export interface CensusFilterState {
  filterFemales: boolean;
  filterMales: boolean;
  groups: number[];
  roles: RolesType[];
}

export interface RolesType {
  selected: boolean;
  value: string;
  color: string;
}
