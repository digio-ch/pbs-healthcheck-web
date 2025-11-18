import {Injectable} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {BehaviorSubject} from 'rxjs';
import { OverviewDepartmentsRegion } from '../models/overview-department';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverviewDepartmentService {

  private regions = new BehaviorSubject<OverviewDepartmentsRegion[]>([]);

  public readonly regions$ = this.regions.asObservable();

  constructor(
    private apiService: ApiService,
  ) {}

  public load(groupId: number) {
    return this.apiService.get(`groups/${groupId}/app/overview/departments`).pipe(
      first(),
      tap((data) => {
        this.regions.next(data);
      })
    );
  }
  
  hasRegions(): boolean {
    return this.regions.getValue().length > 0;
  }
}


