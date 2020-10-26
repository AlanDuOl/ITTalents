import { HttpClient } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { ErrorService } from 'src/app/error.service';

import { AuthorizeService } from './authorize.service';
import { mockBaseUrl } from '../app/mock-data';
import { of } from 'rxjs';

let mockErrorService: Partial<ErrorService>;
let mockHttp: Partial<HttpClient>;
let http: HttpClient;

describe('AuthorizeService', () => {
  beforeEach(() => {
    mockErrorService = { 
      handleObservableError: jasmine.createSpy('handleObservableError').and.callFake(() => {})
    }
    mockHttp = { 
      get: jasmine.createSpy('get').and.returnValues(of(['Admin']), of(null))
    }
    TestBed.configureTestingModule({
      providers: [
        AuthorizeService,
        { provide: ErrorService, useValue: mockErrorService },
        { provide: HttpClient, useValue: mockHttp },
        { provide: 'BASE_URL', useValue: mockBaseUrl }
      ]
    });
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([AuthorizeService], (service: AuthorizeService) => {
    expect(service).toBeTruthy();
  }));

  it('#isAuthenticated should return true',
  inject([AuthorizeService], (service: AuthorizeService) => {
    // arrange
    // make #getUser return valid object
    spyOn(service, 'getUser').and.returnValue(of({ name: 'fakeUser' }));

    // act
    const result = service.isAuthenticated();

    // assert
    result.subscribe(
      res => {
        expect(res).toBe(true);
      },
      // this should not run
      () => {
        expect(false).toBe(true);
      }
    )
  }));

  it('#isAuthenticated should return false',
  inject([AuthorizeService], (service: AuthorizeService) => {
    // arrange
    // make #getUser return null
    spyOn(service, 'getUser').and.returnValue(of(null));
    
    // act
    const result = service.isAuthenticated();

    // assert
    result.subscribe(
      res => {
        expect(res).toBe(false);
      },
      // this should not run
      () => {
        expect(false).toBe(true);
      }
    )
  }));

  it('#isAuthorized should return true or false with required role',
  inject([AuthorizeService], (service: AuthorizeService) => {
    // arrange
    // case 1: user have allowed role
    // act
    let result = service.isAuthorized(['Admin']);

    // assert
    result.subscribe(
      res => {
        expect(res).toBe(true);
      },
      // this should not run
      () => {
        expect(false).toBe(true);
      }
    );

    // case 2: user does not have allowed role
    // act
    result = service.isAuthorized(['Admin']);

    // assert
    result.subscribe(
      res => {
        expect(res).toBe(false);
      },
      // this should not run
      () => {
        expect(false).toBe(true);
      }
    );
  }));

  it('#isAuthorized should return true or false without required role',
  inject([AuthorizeService], (service: AuthorizeService) => {
    // arrange
    // case 1: user has Admin role
    // act
    let result = service.isAuthorized(null);

    // assert
    // should deny access
    result.subscribe(
      res => {
        expect(res).toBe(false);
      },
      // this should not run
      () => {
        expect(false).toBe(true);
      }
    );

    // case 2: user does not have allowed role
    // act
    result = service.isAuthorized(null);

    // assert
    // should allow access
    result.subscribe(
      res => {
        expect(res).toBe(true);
      },
      // this should not run
      () => {
        expect(false).toBe(true);
      }
    );
  }));
});
