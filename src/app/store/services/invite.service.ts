import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Permission} from '../../shared/models/permission';
import {catchError, map} from 'rxjs/operators';
import {InviteAdapter} from '../../shared/adapters/invite.adapter';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(
    private http: HttpClient,
    private inviteAdapter: InviteAdapter
  ) { }

  public getAllInvites(groupId: number): Observable<Permission[]>
  {
    const baseUrl = environment.api + '/groups/' + groupId + '/invite';
    return this.http.get(baseUrl).pipe(
      map((data: any[]) => this.inviteAdapter.adaptArray(data))
    );
  }

  public createInvite(groupId: number, invite: Permission): Observable<Permission>
  {
    const baseUrl = environment.api + '/groups/' + groupId + '/invite';
    return this.http.post(baseUrl, invite).pipe(
      map(item => this.inviteAdapter.adapt(item))
    );
  }

  public deleteInvite(groupId: number, inviteId: number)
  {
    const baseUrl = environment.api + '/groups/' + groupId + '/invite/' + inviteId;
    return this.http.delete(baseUrl);
  }
}
