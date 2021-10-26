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
export class AuthService {
  constructor(
    private http: HttpClient,
    private userAdapter: PersonAdapter
  ) { }

  openOAuth(action?: string, state?: string) {
    const url = new URL(environment.oauth.url);
    url.searchParams.append('response_type', environment.oauth.responseType);
    url.searchParams.append('client_id', environment.oauth.clientId);
    const redirectUri = action ? environment.oauth.redirectUri + '?action=' + action : environment.oauth.redirectUri;
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', environment.oauth.scope);
    if (state) {
      url.searchParams.append('state', state);
    }
    window.open(url.toString(), '_self');
  }

  public login(code: string): Observable<Person> {
    return this.http.post<Person>(environment.api + '/oauth/v2/code', {code})
      .pipe(map(user => this.userAdapter.adapt(user))
    );
  }

  public logout(): Observable<any> {
    return this.http.get(environment.api + '/logout');
  }
}
