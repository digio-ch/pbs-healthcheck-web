import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { Preview } from '../models/preview';

@Injectable({
  providedIn: 'root'
})
export class MyOrganizationService {
  private apiService = inject(ApiService);

  getPreview(groupId: number): Observable<Preview> {
    return this.apiService.get(`groups/${groupId}/app/my-organization/preview`);
  }
}