import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, forkJoin, Observable, of} from 'rxjs';
import {catchError, combineAll, first, map, skip, tap} from 'rxjs/operators';
import {Group} from '../../shared/models/group';
import {CensusService} from './census.service';
import {ApiService} from '../../shared/services/api.service';
import {GroupService} from './group.service';
import {GroupFacade} from '../facade/group.facade';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CensusFilterService {
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
  public initialized = new BehaviorSubject<boolean>(false);
  public filterableStrings = ['biber' , 'woelfe', 'pfadis', 'rover', 'pio', 'pta', 'leiter'];

  private preventFetch = false;

  constructor(
    private censusService: CensusService,
    private apiService: ApiService,
    private groupFacade: GroupFacade
  ) {
  }
  public loadFilterData(group: Group) {
    this.preventFetch = true;
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
        this.setRoleFilter(roleCopy);

        this.groupFilter.next(filterData.groups.map(el => parseInt(el, 10)));
        this.initialized.next(true);
        this.getUpdates$().pipe(skip(1)).subscribe(el => this.updateFilter(el));
      }),
      catchError(err => {
        this.preventFetch = false;
        return of(err);
      })
    );
  }

  public getUpdates$() {
    return combineLatest([
      this.groupFilter.asObservable(),
      this.roleFilter.asObservable(),
      this.filterFemales.asObservable(),
      this.filterMales.asObservable()
    ]).pipe(
      map(([groups, roles, filterFemales, filterMales]) => ({
        groups,
        roles,
        filterFemales,
        filterMales
      }),
      ));
  }

  public getMF$() {
    return forkJoin([this.filterFemales.asObservable(), this.filterMales.asObservable()])
      .pipe(map(([females, males]) => ({
        filterFemales: females,
        filterMales: males
    })));
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
    return this.apiService.post(`groups/${this.groupFacade.getCurrentGroupSnapshot().id}/app/census/filter`, {}, {params}).toPromise();
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

export interface CensusFilterDTO {
  filterFemales: boolean;
  filterMales: boolean;
  groups: number[];
  roles: string[];
}