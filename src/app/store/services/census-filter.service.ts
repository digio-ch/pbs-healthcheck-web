import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CensusFilterService {
  public filterStrings: string[] = ['m'];
  public departmentFilter: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public roleFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public genderFilter: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public filterableStrings = ['biber' , 'woelfe', 'pfadis', 'rover', 'pio', 'pta', 'leiter'];

  constructor() {
    this.filterMF = this.filterMF.bind(this);
  }

  public filterMF(dataObject: RawData) {
    const filterM = this.filterStrings.find(v => v === 'm');
    const filterF = this.filterStrings.find(v => v === 'f');
    Object.entries(dataObject).forEach(([key, value]) => {
      // filter out any categories
      if (this.filterStrings.find(v => v === key)) {
        dataObject[key].m = 0;
        dataObject[key].f = 0;
      }
      // filter out m/f, checking if key exists to because certain attributes (name, id...) shouldn't be affected.
      if (filterM && dataObject[key].m) {
        dataObject[key].m = 0;
      }
      if (filterF && dataObject[key].f) {
        dataObject[key].f = 0;
      }
    });
  }
  public registerFilteredMembersChart(data: RawData[], updateChartFn) {
    data.forEach(this.filterMF);
    return data;
  }

  public getFilteredMembersData(data: RawData[]) {
    return data;
  }

  public getUpdates$() {
    return combineLatest([this.departmentFilter.asObservable(), this.roleFilter.asObservable(), this.genderFilter.asObservable()])
      .pipe(map(([departments, roles, genders]) => ({
        departments,
        roles,
        genders
      })));
  }
}

interface RawData {
  id: number;
  name: string;
  biber: MF;
  woelfe: MF;
  pfadis: MF;
  rover: MF;
  pio: MF;
  pta: MF;
  leiter: MF;
}

interface MF {
  m: number;
  f: number;
}

export interface CensusFilterState {
  departments: number[];
  roles: string[];
  genders: string[];
}
