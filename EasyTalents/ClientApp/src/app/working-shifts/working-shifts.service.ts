import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkingShift, FrontEndError } from '../modeldata';
import { apiPath, errorType  } from '../constants';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class WorkingShiftsService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private error: ErrorService) { }

  public fetch(): Observable<WorkingShift[]> {
    return this.http.get<WorkingShift[]>(`${this.baseUrl}${apiPath.workingShifts}`).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'working-shift-service fetch')))
    );
  }
}
