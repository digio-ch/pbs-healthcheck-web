import { Injectable } from '@angular/core';
import {ApiService} from '../../shared/services/api.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {CensusFilterDTO} from './census-filter.service';

@Injectable({
  providedIn: 'root'
})
export class CensusService {
  constructor(
    private apiService: ApiService,
  ) { }

  public getPreview(groupId: number) {
    return this.apiService.get(`groups/${groupId}/app/census/preview`);
  }

  public getFilter(groupId: number): Observable<CensusFilterDTO> {
    return this.apiService.get(`groups/${groupId}/app/census/filter`);
  }
}
