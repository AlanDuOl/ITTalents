import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from './authorize.service';
import { tap } from 'rxjs/operators';
import { ApplicationPaths, QueryParameterNames } from './api-authorization.constants';
import { redirectCode } from '../app/constants';
import { ProfilesService } from '../app/profiles/profiles.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate, CanActivateChild {
  constructor(private authorize: AuthorizeService, private router: Router, private profiles: ProfilesService) {
  }
  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authorize.isAuthenticated()
        .pipe(tap(isAuthenticated => this.handleAuthorization(isAuthenticated, state)));
  }
  canActivateChild(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = !!_next.data ? _next.data.allowedRoles : null;
    return this.authorize.isAuthorized(allowedRoles)
      .pipe(tap(isAuthorized => this.handleRoleAuthorization(isAuthorized)));
  }

  private handleAuthorization(isAuthenticated: boolean, state: RouterStateSnapshot) {
    if (!isAuthenticated) {
      this.router.navigate(ApplicationPaths.LoginPathComponents, {
        queryParams: {
          [QueryParameterNames.ReturnUrl]: state.url
        }
      });
    }
    else {
      this.profiles.setUserProfile();
    }
  }

  private handleRoleAuthorization(isAuthorized: boolean) {
    if (!isAuthorized) {
      this.router.navigate(['error', redirectCode.forbid]);
    }
  }
}
