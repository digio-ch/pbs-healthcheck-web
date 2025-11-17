import {Injectable} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {BehaviorSubject} from 'rxjs';
import { OverviewDepartmentsRegion } from '../models/overview-department';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverviewDepartmentService {

  private regions = new BehaviorSubject<OverviewDepartmentsRegion[]>([]);

  public readonly regions$ = this.regions.asObservable();

  constructor(
    private apiService: ApiService,
  ) {}

  load(groupId: number) {
    this.apiService.get(`groups/${groupId}/app/overview/departments`).pipe(
      first(),
    ).subscribe((data) => {
      this.regions.next(data);
    });
  } 
}


