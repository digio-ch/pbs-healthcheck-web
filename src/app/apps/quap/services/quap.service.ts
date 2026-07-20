import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { lastValueFrom, Observable } from 'rxjs';
import { DateSelection } from '../../../shared/models/date-selection/date-selection';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { DefaultFilterFacade } from '../../../store/facade/default-filter.facade';
import { GamificationService } from '../../../store/services/gamification.service';
import moment from 'moment';
import { groupTypeToQuestionnaireType } from '../models/questionnaire';

@Injectable({
  providedIn: 'root'
})
export class QuapService {
  private apiService = inject(ApiService);
  private filterFacade = inject(DefaultFilterFacade);
  private gamificationService = inject(GamificationService);


  getPreview(groupId: number): Observable<any> {
    return this.apiService.get(`groups/${groupId}/app/quap/preview`);
  }

  getSharedPreview(groupId: number): Observable<any> {
    return this.apiService.get(`groups/${groupId}/app/quap/groups/preview`);
  }

  getQuestionnaire(dateSelection: DateSelection, groupType: string): Observable<any> {
    const type = groupTypeToQuestionnaireType(groupType);
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();
    params = params.append('date', date);

    return this.apiService.get(`quap/questionnaire/${type}`, { params });
  }

  submitAnswers(groupId: number, answers: any): Promise<any> {
    const res = lastValueFrom(this.apiService.post(`groups/${groupId}/app/quap/questionnaire`, answers));

    this.gamificationService.fetchCheckLevel();

    return res;
  }

  getAnswers(dateSelection: DateSelection, groupId: number): Observable<any> {
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();

    if (!this.filterFacade.isLatestSelected()) {
      params = params.append('date', date);
    }

    return this.apiService.get(`groups/${groupId}/app/quap/questionnaire`, { params });
  }

  getSharedAnswers(dateSelection: DateSelection, groupId: number): Observable<any> {
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();

    // we can not use the isLatestSelected function because it only checks if the selected date is the latest data point
    // if the aggregation didn't ran and the latest data point is not today it won't work
    // therefore we have to check if the selected date is today
    if (!this.filterFacade.isTodaySelected()) {
      params = params.append('date', date);
    }

    return this.apiService.get(`groups/${groupId}/app/quap/groups`, { params });
  }

  exportQuap(groupId: number, date: moment.Moment): Observable<HttpResponse<Blob>> {
    return this.downloadQuap(`groups/${groupId}/app/quap/download`, date)
  }

  exportSharedQuap(groupId: number, subordinateGroupId: number, date: moment.Moment): Observable<HttpResponse<Blob>> {
    return this.downloadQuap(`groups/${groupId}/app/quap/groups/${subordinateGroupId}/download`, date)
  }

  exportAllSharedQuaps(groupId: number, date: moment.Moment): Observable<HttpResponse<Blob>> {
    return this.downloadQuap(`groups/${groupId}/app/quap/groups/download`, date)
  }

  private downloadQuap(path: string, date: moment.Moment): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();
    
    if (!this.filterFacade.isLatestSelected()) {
      params = params.append('date', date.format('YYYY-MM-DD'));
    }


    return this.apiService.get(path, {
      params,
      observe: 'response',
      responseType: 'blob',
    });
  }
}
