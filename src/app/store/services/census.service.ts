import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CensusService {
  private apiService = inject(ApiService);


  public getPreview(groupId: number) {
    return this.apiService.get(`groups/${groupId}/app/census/preview`);
  }

  public getFilter(groupId: number): Observable<RawCensusFilterDTO> {
    return this.apiService.get(`groups/${groupId}/app/census/filter`);
  }
}

export interface RawCensusFilterDTO {
  filterFemales: boolean;
  filterMales: boolean;
  groups: string[];
  roles: string[];
}
