import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import { StatusMessage } from '../models/status-message';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
        if (!response || response.severity === StatusMessage.SEVERITY_NONE) {
          return null
        }

        const message = JSON.parse(response.message);

        return new StatusMessage(response.severity, message.title, message.body);
      })
    )
  }
}
