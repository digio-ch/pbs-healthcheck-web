import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Person} from '../../shared/models/person';
import {map} from 'rxjs/operators';
import {PersonAdapter} from '../../shared/adapters/person.adapter';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  constructor(
    private http: HttpClient,
  ) { }

  public sync(groupId: string, code: string): Observable<void> {
    return this.http.post<void>(environment.api + '/groups/' + groupId + '/sync', {code});
  }
}
