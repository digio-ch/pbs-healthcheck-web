import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { Preview } from '../models/preview';
import { HttpParams } from '@angular/common/http';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MyOrganizationService {
  private apiService = inject(ApiService);

  getPreview(groupId: number): Observable<Preview> {
    return this.apiService.get(`groups/${groupId}/app/my-organization/preview`);
  }

  getDepartmentNames(groupId: number, date: Moment): Observable<string[]> {
    const params = new HttpParams().append(
      'date', 
      date.format('YYYY-MM-DD')
    );

    return this.apiService.get(`groups/${groupId}/app/my-organization/departments`, { params });
  }
}