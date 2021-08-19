import { Injectable } from '@angular/core';
import {ApiService} from '../../../../../shared/services/api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuapService {

  constructor(
    private apiService: ApiService,
  ) { }

  getQuestionnaire(): Observable<any> {
    // TODO evaluate the questionnaire type
    const type = 'Questionnaire::Group::Default';

    return this.apiService.get(`quap/questionnaire/${type}`);
  }

  getAnswers(groupId: number): Observable<any> {
    return this.apiService.get(`group/${groupId}/quap/questionnaire`);
  }
}
