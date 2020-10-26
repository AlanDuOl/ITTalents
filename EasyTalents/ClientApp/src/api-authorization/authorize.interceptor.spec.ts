import { HttpEvent, HttpHandler, HttpHeaderResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { AuthorizeInterceptor } from './authorize.interceptor';
import { AuthorizeService } from './authorize.service';

let mockAuthService: Partial<AuthorizeService>;
const fakeTokenString = 'validValue';

describe('AuthorizeInterceptor', () => {
  beforeEach(() => {
    mockAuthService = {
        getAccessToken: jasmine.createSpy('getAccessToken').and.returnValues(of(fakeTokenString), of(null))
    }
    TestBed.configureTestingModule({
      providers: [
        AuthorizeInterceptor,
        { provide: AuthorizeService, useValue: mockAuthService }
      ]
    });
  });

  it('should be created', inject([AuthorizeInterceptor], (service: AuthorizeInterceptor) => {
    expect(service).toBeTruthy();
  }));

  it('should add token to request 1', inject([AuthorizeInterceptor], (service: AuthorizeInterceptor) => {
    // request with same origin and valid token
    const request = new HttpRequest('GET', `${window.location.origin}/API`);
    const expectedHeaderValue = `Bearer ${fakeTokenString}`;
    const handler: HttpHandler = {
        handle(req): Observable<HttpEvent<any>> { 
          return of(new HttpHeaderResponse({
          headers: req.headers
        }))
      }
    };
    const result = service.intercept(request, handler);
    result.subscribe(
      (res: HttpHeaderResponse) => {
        expect(res.headers.get('Authorization')).toBe(expectedHeaderValue);
      },
      () => {
        expect(true).toBe(false);
      }
    );
  }));

  it('should not add token to request 2', inject([AuthorizeInterceptor], (service: AuthorizeInterceptor) => {
    // request with different origin and valid token
    let url = `invalidUrl`
    let request = new HttpRequest('GET', url);
    let handler: HttpHandler = {
        handle(req): Observable<HttpEvent<any>> { 
          return of(new HttpHeaderResponse({
            headers: req.headers
        }))
      }
    };
    let result = service.intercept(request, handler);
    result.subscribe(
      (res: HttpHeaderResponse) => {
        expect(res.headers.get('Authorization')).toBeNull();
      },
      () => {
        expect(true).toBe(false);
      }
    );

    // request with same origin and invalid token
    // set url with same origin and update 'request' and 'handler'
    url = `${window.location.origin}/API`;
    request = new HttpRequest('GET', url);
    handler = {
        handle(req): Observable<HttpEvent<any>> { 
          return of(new HttpHeaderResponse({
            headers: req.headers
        }))
      }
    };
    result = service.intercept(request, handler);
    result.subscribe(
      (res: HttpHeaderResponse) => {
        expect(res.headers.get('Authorization')).toBeNull();
      },
      () => {
        expect(true).toBe(false);
      }
    );
  }));
});
