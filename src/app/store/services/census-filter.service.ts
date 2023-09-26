import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, forkJoin, of} from 'rxjs';
import {catchError, combineAll, first, map, tap} from 'rxjs/operators';
import {Group} from '../../shared/models/group';
import {CensusService} from './census.service';

@Injectable({
  providedIn: 'root'
})
export class CensusFilterService {
  public roleFilter = new BehaviorSubject([
    {
      value: 'biber',
      color: '#EEE09F',
      selected: true,
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
      color: '#929292',
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
    private censusService: CensusService
  ) {}
  public loadFilterData(group: Group) {
    this.preventFetch = true;
    return this.censusService.getFilter(group.id).pipe(
      first(),
      tap(filterData => {
        this.initialized.next(true);
        this.filterMales.next(filterData.filterMales);
        this.filterFemales.next(filterData.filterFemales);

        console.log('RoleFilterData', filterData.roles);
        const roleCopy = this.roleFilter.getValue();
        roleCopy.forEach(el => {
          if (filterData.roles.find(role => role === el.value)) {
            el.selected = false;
          } else {
            el.selected = true;
          }
        });
        this.roleFilter.next(roleCopy);

        this.groupFilter.next(filterData.groups);

        this.preventFetch = false;
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
    ]).pipe(map(([groups, roles, filterFemales, filterMales]) => ({
        groups,
        roles,
        filterFemales,
        filterMales
      })));
  }

  public getMF$() {
    return forkJoin([this.roleFilter.asObservable(), this.filterFemales.asObservable(), this.filterMales.asObservable()])
      .pipe(map(([roles, females, males]) => ({
        roles,
        filterFemales: females,
        filterMales: males
    })));
  }

  public getRoleFilter$() {
    return this.roleFilter.asObservable();
  }

  public getRoleFilterSnapshot() {
    return this.roleFilter.getValue();
  }

  public isPreventFetch(): boolean {
    return this.preventFetch;
  }

  public setRoleFilter(nextValue) {
    this.roleFilter.next(nextValue);
  }
}

export interface CensusFilterState {
  filterFemales: boolean;
  filterMales: boolean;
  groups: number[];
  roles: {
    selected: boolean,
    value: string,
    color: string,
  }[];
}

export interface CensusFilterDTO {
  filterFemales: boolean;
  filterMales: boolean;
  groups: number[];
  roles: string[];
}
