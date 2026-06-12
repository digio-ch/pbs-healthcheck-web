import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { BehaviorSubject } from 'rxjs';
import { OverviewDepartmentsRegion } from '../models/overview-department';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverviewDepartmentService {
  private apiService = inject(ApiService);


  private regions = new BehaviorSubject<OverviewDepartmentsRegion[] | null>(null);

  public readonly regions$ = this.regions.asObservable();

  public load(groupId: number) {
    return this.apiService.get(`groups/${groupId}/app/overview/departments`).pipe(
      first(),
      tap((data) => {
        this.regions.next(data);
      })
    );
  }
  
  hasRegions(): boolean {
    const regions = this.regions.getValue(); 
    return regions !== null && regions.length > 0;
  }
}
