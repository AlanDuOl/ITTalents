import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DailyWorkingHours, FrontEndError } from '../modeldata';
import { apiPath, errorType, dailyWorkingHours } from '../constants';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class WorkingHoursService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private error: ErrorService) { }

  public fetch(): Observable<DailyWorkingHours[]> {
    return this.http.get<DailyWorkingHours[]>(`${this.baseUrl}${apiPath.daylyWorkingHours}`).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'working-hours-service fetch')))
    );
  }
}
