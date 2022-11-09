import {Injectable} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {Observable} from 'rxjs';

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
}
