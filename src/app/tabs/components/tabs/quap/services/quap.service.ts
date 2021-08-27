import { Injectable } from '@angular/core';
import {ApiService} from '../../../../../shared/services/api.service';
import {Observable} from 'rxjs';
import {DateSelection} from '../../../../../shared/models/date-selection/date-selection';
import {HttpParams} from '@angular/common/http';
import {FilterFacade} from '../../../../../store/facade/filter.facade';

@Injectable({
  providedIn: 'root'
})
export class QuapService {

  constructor(
    private apiService: ApiService,
    private filterFacade: FilterFacade,
  ) { }

  getQuestionnaire(dateSelection: DateSelection): Observable<any> {
    // TODO evaluate the questionnaire type
    const type = 'Questionnaire::Group::Default';
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();
    params = params.append('date', date);

    return this.apiService.get(`quap/questionnaire/${type}`, { params });
  }

  submitAnswers(groupId: number, answers: any): Observable<any> {
    return this.apiService.post(`groups/${groupId}/quap/questionnaire`, answers);
  }

  getAnswers(dateSelection: DateSelection, groupId: number): Observable<any> {
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();
    if (!this.filterFacade.isTodaySelected()) {
      params = params.append('date', date);
    }

    return this.apiService.get(`groups/${groupId}/quap/questionnaire`, { params });
  }
}
