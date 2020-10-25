import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { redirectCode, uiPath } from 'src/app/constants';
import { ProfilesService } from 'src/app/profiles/profiles.service';

import { AuthorizeGuard } from './authorize.guard';
import { AuthorizeService } from './authorize.service';

let mockAuthService: Partial<AuthorizeService>;
let authorize: AuthorizeService;
let mockRouter: Partial<Router>;
let router: Router;
let mockProfilesService: Partial<ProfilesService>;
let profiles: ProfilesService;
let scheduler: TestScheduler;

describe('AuthorizeGuard', () => {
  mockAuthService = {
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValues(of(true), of(false)),
    isAuthorized: jasmine.createSpy('isAuthorized').and.returnValues(of(true), of(false))
  }
  mockProfilesService = {
    setUserProfile: jasmine.createSpy('setUserProfile').and.callFake(() => {})
  }
  mockRouter = {
    navigate: jasmine.createSpy('navigate').and.callFake(() => {})
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthorizeGuard,
        { provide: AuthorizeService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ProfilesService, useValue: mockProfilesService },
      ]
    });
    authorize = TestBed.get(AuthorizeService);
    router = TestBed.get(Router);
    profiles = TestBed.get(ProfilesService);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('#canActivate should be loaded', inject([AuthorizeGuard], (guard: AuthorizeGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should be true or false', inject([AuthorizeGuard], (guard: AuthorizeGuard) => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routeState: RouterStateSnapshot = {
      url: '',
      root: routeSnapshot
    };
    // case 1: canActiveted return observable that emits true
    // user is set in profiles service
    const resultTrue = guard.canActivate(routeSnapshot, routeState);
    if (resultTrue instanceof Observable) {
      scheduler.run(({ expectObservable } ) => {
        const expectedMarbles = "(a|)";
        const expectedResult = { a: true }
        expectObservable(resultTrue).toBe(expectedMarbles, expectedResult);
      });
      // this should only be called when user is not authenticated
      expect(router.navigate).not.toHaveBeenCalled();
      expect(profiles.setUserProfile).toHaveBeenCalled();
    }
    else {
      // this should not run
      expect(true).toBe(false);
    }

    // case 2: canActiveted return observable that emits false
    // navigate is called
    const resultFalse = guard.canActivate(routeSnapshot, routeState);
    if (resultFalse instanceof Observable) {
      scheduler.run(({ expectObservable } ) => {
        const expectedMarbles = "(a|)";
        const expectedResult = { a: false }
        expectObservable(resultFalse).toBe(expectedMarbles, expectedResult);
      });
      expect(router.navigate).toHaveBeenCalled();
      // this function has been called when the rusult was true
      // it should not be called a second time
      expect(profiles.setUserProfile).toHaveBeenCalledTimes(1);
    }
    else {
      // this should not run
      expect(true).toBe(false);
    }
  }));

  it('#canActivateChild should be true or false', inject([AuthorizeGuard], (guard: AuthorizeGuard) => {
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routeState: RouterStateSnapshot = {
      url: '',
      root: routeSnapshot
    };
    // case 1: canActiveted return observable that emits true
    // user is set in profiles service
    const resultTrue = guard.canActivateChild(routeSnapshot, routeState);
    if (resultTrue instanceof Observable) {
      scheduler.run(({ expectObservable } ) => {
        const expectedMarbles = "(a|)";
        const expectedResult = { a: true }
        expectObservable(resultTrue).toBe(expectedMarbles, expectedResult);
      });
    }
    else {
      // this should not run
      expect(true).toBe(false);
    }

    // case 2: canActiveted return observable that emits false
    // navigate is called
    const expectedValue = [uiPath.error, redirectCode.forbid];
    const resultFalse = guard.canActivateChild(routeSnapshot, routeState);
    if (resultFalse instanceof Observable) {
      scheduler.run(({ expectObservable } ) => {
        const expectedMarbles = "(a|)";
        const expectedResult = { a: false }
        expectObservable(resultFalse).toBe(expectedMarbles, expectedResult);
      });
      expect(router.navigate).toHaveBeenCalledWith(expectedValue);
    }
    else {
      // this should not run
      expect(true).toBe(false);
    }
  }));
});
