import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Severity } from '../models/status-message';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  private apiService = inject(ApiService);


  getStatusMessage() {
    return this.apiService.get('status-message')
    .pipe(
      map(response => {
        if (!response || response.severity === Severity.None) {
          return null
        }
        
        return {
          severity: response.severity,
          title: response.message.title,
          body: response.message.body,
        }
      })
    )
  }
}
