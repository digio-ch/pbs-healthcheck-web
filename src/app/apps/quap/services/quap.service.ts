import { Injectable } from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {Observable} from 'rxjs';
import {DateSelection} from '../../../shared/models/date-selection/date-selection';
import {HttpParams} from '@angular/common/http';
import {FilterFacade} from '../../../store/facade/filter.facade';
import {GroupFacade} from '../../../store/facade/group.facade';
import {Group} from '../../../shared/models/group';
import {GroupType} from '../../../shared/models/group-type';

@Injectable({
  providedIn: 'root'
})
export class QuapService {

  constructor(
    private apiService: ApiService,
    private filterFacade: FilterFacade,
  ) { }

  getPreview(groupId: number): Observable<any> {
    return this.apiService.get(`groups/${groupId}/app/quap/preview`);
  }

  getDepartmentPreview(groupId: number): Observable<any> {
    return this.apiService.get(`groups/${groupId}/app/quap/subdepartments/preview`);
  }

  getQuestionnaire(dateSelection: DateSelection, groupType: string): Observable<any> {
    const type = groupType === GroupType.DEPARTMENT_KEY ? 'Questionnaire::Group::Default' : 'Questionnaire::Group::Canton';
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();
    params = params.append('date', date);

    return this.apiService.get(`quap/questionnaire/${type}`, { params });
  }

  submitAnswers(groupId: number, answers: any): Promise<any> {
    return this.apiService.post(`groups/${groupId}/app/quap/questionnaire`, answers).toPromise();
  }

  getAnswers(dateSelection: DateSelection, groupId: number): Observable<any> {
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();
    if (!this.filterFacade.isTodaySelected()) {
      params = params.append('date', date);
    }

    return this.apiService.get(`groups/${groupId}/app/quap/questionnaire`, { params });
  }

  getSubdepartmentAnswers(dateSelection: DateSelection, groupId: number): Observable<any> {
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();
    if (!this.filterFacade.isTodaySelected()) {
      params = params.append('date', date);
    }

    return this.apiService.get(`groups/${groupId}/app/quap/subdepartments`, { params });
  }
}
