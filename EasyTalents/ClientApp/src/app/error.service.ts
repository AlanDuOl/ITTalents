import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LogService } from './log.service';
import { FrontEndError } from './modeldata';
import { RedirectService } from './redirect.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private logService: LogService, private redirect: RedirectService) { }

  public handleObservableError<T>(frontEndError: FrontEndError, result?: T): any {
    return (error: any): Observable<T> => {
      frontEndError.message = error.message;
      this.logService.logToApi(frontEndError).subscribe();
      return of(result as T);
    };
  }

  public logRethrowObservableRequestError(frontEndError: FrontEndError): any {
    return (error: any): void => {
      frontEndError.message = error.message;
      this.logService.logToApi(frontEndError).subscribe();
      throw error;
    };
  }

  public handleRedirectRequestError<T>(result: T = null): any {
    return (error: any): Observable<T> => {
      this.redirect.redirectOnRequestError(+error.status);
      return of(result as T);
    };
  }

  public handleFrontEndError(error: FrontEndError): void {
    this.logService.logToApi(error).subscribe();
  }

  public handleBuiltInError(error: any, errorPath: string): void {
    const frontEndError = new FrontEndError(error.constructor.name, errorPath, error.message)
    this.logService.logToApi(frontEndError).subscribe();
  }
}
