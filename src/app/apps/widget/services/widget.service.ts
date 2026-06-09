import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private apiService = inject(ApiService);


  getPreview(groupId: number): Observable<any> {
    return this.apiService.get(`groups/${groupId}/app/widgets/preview`);
  }

  getDepartmentsPreview(groupId: number): Observable<any> {
    return this.apiService.get(`groups/${groupId}/app/overview/departments/preview`);
  }

  getCensusPreview(groupId: number): Observable<any> {
    return this.apiService.get(`census/${groupId}/app/census/preview`);
  }
}


