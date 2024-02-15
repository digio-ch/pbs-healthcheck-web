import {Injectable} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  constructor(
    private apiService: ApiService,
  ) {}

  getPreview(groupId: number): Observable<any> {
    return this.apiService.get(`groups/${groupId}/app/widgets/preview`);
  }

  getCensusPreview(groupId: number): Observable<any> {
    return this.apiService.get(`census/${groupId}/app/census/preview`);
  }
}


