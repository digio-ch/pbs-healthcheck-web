import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import { Severity, StatusMessage } from '../models/status-message';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  constructor(
    private apiService: ApiService
  ) { }

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
