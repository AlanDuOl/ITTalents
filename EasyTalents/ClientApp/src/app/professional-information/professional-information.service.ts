import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProfessionalInformation, FrontEndError } from '../modeldata';
import { apiPath, errorType } from '../constants';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalInformationService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private error: ErrorService) { }

  public fetch(): Observable<ProfessionalInformation[]> {
    return this.http.get<ProfessionalInformation[]>(`${this.baseUrl}${apiPath.professionalInformation}`).pipe(
      catchError(this.error.logRethrowObservableRequestError(new FrontEndError(errorType.observable,
        'professional-info service #fetch')))
    );
  }
}
