import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { lastValueFrom, Observable } from 'rxjs';
import { DateSelection } from '../../../shared/models/date-selection/date-selection';
import { HttpParams } from '@angular/common/http';
import { DefaultFilterFacade } from '../../../store/facade/default-filter.facade';
import { GroupType } from '../../../shared/models/group-type';
import { GamificationService } from '../../../store/services/gamification.service';

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

  getSubdepartmentAnswers(dateSelection: DateSelection, groupId: number): Observable<any> {
    const date = dateSelection.startDate.format('YYYY-MM-DD');

    let params = new HttpParams();

    // we can not use the isLatestSelected function because it only checks if the selected date is the latest data point
    // if the aggregation didn't ran and the latest data point is not today it won't work
    // therefore we have to check if the selected date is today
    if (!this.filterFacade.isTodaySelected()) {
      params = params.append('date', date);
    }

    return this.apiService.get(`groups/${groupId}/app/quap/subdepartments`, { params });
  }
}
