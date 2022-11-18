import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.api;
  }

  get(path: string, options?: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${path}`, options);
  }

  post(path: string, body: any, options?: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${path}`, body, options);
  }

  patch(path: string, body: any, options?: any): Observable<any> {
    return this.httpClient.patch(`${this.baseUrl}/${path}`, body, options);
  }
}
