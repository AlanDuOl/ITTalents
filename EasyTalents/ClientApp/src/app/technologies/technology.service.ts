import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Technology, FrontEndError } from '../modeldata';
import { apiPath, errorType } from '../constants';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private error: ErrorService) { }

  public fetch(): Observable<Technology[]> {
    return this.http.get<Technology[]>(`${this.baseUrl}${apiPath.technologies}`).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'technology-service fetch')))
    );
  }
}
