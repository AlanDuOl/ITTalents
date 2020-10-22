import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RedirectService } from './redirect.service';
import { uiPath, redirectCode } from './constants';

describe('RedirectService', () => {
  let service: RedirectService;
  let mockRouter: Partial<Router>;
  let router: Router;

  beforeEach(() => {
      mockRouter = { navigate: jasmine.createSpy('navigate').and.callThrough() }
      TestBed.configureTestingModule({
        providers: [
          { provide: Router, useValue: mockRouter }
        ]
      }),
      router = TestBed.get(Router);
      service = TestBed.get(RedirectService);
    }
  );

  it('should be created', () => {
    const service: RedirectService = TestBed.get(RedirectService);
    expect(service).toBeTruthy();
  });

  it('should redirect based on param', () => {
    // test case 1: testCode value between 500 - 599
    let expectedParameter = [uiPath.error, redirectCode.serverError];
    let testCode = 500 + Math.floor(Math.random() * 99);
    service.redirectOnRequestError(testCode);
    expect(router.navigate).toHaveBeenCalledWith(expectedParameter);

    // test case 2: testCode value = 401
    expectedParameter = [uiPath.error, redirectCode.notAllowed];
    testCode = 401;
    service.redirectOnRequestError(testCode);
    expect(router.navigate).toHaveBeenCalledWith(expectedParameter);

    // test case 3: testCode value = 403
    expectedParameter = [uiPath.error, redirectCode.forbid];
    testCode = 403;
    service.redirectOnRequestError(testCode);
    expect(router.navigate).toHaveBeenCalledWith(expectedParameter);

    // test case 4: testCode value = 404
    expectedParameter = [uiPath.error, redirectCode.notFound];
    testCode = 404;
    service.redirectOnRequestError(testCode);
    expect(router.navigate).toHaveBeenCalledWith(expectedParameter);

    // test case 5: testCode value = any other value
    expectedParameter = [uiPath.error, redirectCode.unexpected];
    testCode = 200;
    service.redirectOnRequestError(testCode);
    expect(router.navigate).toHaveBeenCalledWith(expectedParameter);
  })
});
