import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FrontEndError } from './modeldata';
import { apiPath } from './constants';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: any) { }

  logToApi(error: FrontEndError): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${apiPath.error}`, error, this.httpOptions);
  }

}
