import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { redirectCode, uiPath } from './constants';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router: Router) { }

  public redirectOnRequestError(statusCode: number): void {
    if (statusCode >= 500 && statusCode < 600) {
      this.router.navigate([uiPath.error, redirectCode.serverError]);
    }
    else if (statusCode === 401) {
      this.router.navigate([uiPath.error, redirectCode.notAllowed]);
    }
    else if (statusCode === 403) {
      this.router.navigate([uiPath.error, redirectCode.forbid]);
    }
    else if (statusCode === 404) {
      this.router.navigate([uiPath.error, redirectCode.notFound]);
    }
    else {
      this.router.navigate([uiPath.error, redirectCode.unexpected]);
    }
  }
}
