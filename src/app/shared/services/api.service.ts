import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpClient = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
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
