import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { LogService } from './log.service';
import { Router } from '@angular/router';
import { FrontEndError } from './modeldata';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { RedirectService } from './redirect.service';

describe('ErrorService', () => {
  let scheduler: TestScheduler;
  let service: ErrorService;
  let mockLog: Partial<LogService>;
  let logService: LogService;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockRedirect: Partial<RedirectService>;
  let redirect: RedirectService;
  let mockFrontEndError: FrontEndError;

  // config area
  beforeEach(async() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  beforeEach(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate').and.callThrough() }
    mockLog = { logToApi: jasmine.createSpy('logToApi').and.returnValue(of(mockFrontEndError))}
    mockRedirect = { redirectOnRequestError: jasmine.createSpy('redirectOnRequestError').and.callThrough() }
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: LogService, useValue: mockLog },
        { provide: RedirectService, useValue: mockRedirect }
      ]
    })
    service = TestBed.get(ErrorService);
    logService = TestBed.get(LogService);
    router = TestBed.get(Router);
    redirect = TestBed.get(RedirectService);
    mockFrontEndError = new FrontEndError('mock', 'app/mock-data', '');
  });

  // test area
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#handleObservableError should return a function', () => {
    // --- expect to return a function
    const observableResult = 'some value';
    const returnFunction = service.handleObservableError<string>(mockFrontEndError, observableResult);
    expect(typeof returnFunction).toEqual('function');

    // --- expect the returned function to:
    const mockError = { message: 'mock message' };
    mockFrontEndError.message = '';
    const logObservable = logService.logToApi(mockFrontEndError);
    const logSubscribeSpy = spyOn(logObservable, 'subscribe').and.callThrough();
    // return an observable 
    const returnObservable = returnFunction(mockError);
    expect(returnObservable instanceof Observable).toBe(true);
    // the observable should emit a value equal to observableResult
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: observableResult };
      expectObservable(returnObservable).toBe(expectedMarbles, expectedValue);
    });
    // set mockError.message to error.message
    expect(mockFrontEndError.message).toEqual(mockError.message);
    // subscribe to observable returned by logToApi
    expect(logService.logToApi).toHaveBeenCalledWith(mockFrontEndError);
    expect(logSubscribeSpy).toHaveBeenCalledTimes(1);
  });

  it('#logRethrowObservableRequestError should return a function', () => {
    const returnFunction = service.logRethrowObservableRequestError(mockFrontEndError);
    expect(typeof returnFunction).toBe('function');
    const mockError = { message: 'new error' }
    // current message values are diferent
    expect(mockFrontEndError.message).not.toBe(mockError.message);
    // the returned function should:
    try {
      returnFunction(mockError);
      // this should not run
      expect(true).toBe(false);
    }
    catch (err) {
      // set mockFrontEndError.message to its calling parameter.message
      expect(mockFrontEndError.message).toBe(mockError.message);
      // call logToApi with updated mockFrontEndError
      expect(logService.logToApi).toHaveBeenCalledWith(mockFrontEndError);
      // throw its calling parameter
      expect(err).toEqual(mockError);
    }
  });

  it('#logRethrowObservableRequestError should subscribe to logToApi', () => {
    const mockError = { message: 'new error' }
    const returnFunction = service.logRethrowObservableRequestError(mockFrontEndError);
    // create the observable with the same error.message
    mockFrontEndError.message = mockError.message;
    const returnObservable = logService.logToApi(mockFrontEndError);
    spyOn(returnObservable, 'subscribe').and.callThrough();
    try {
      returnFunction(mockError);
      // this should not run
      expect(true).toBe(false);
    }
    catch (err) {
      expect(returnObservable.subscribe).toHaveBeenCalled();
    }
  });

  it('#handleRedirectRequestError should return a function', () => {
    // --- expect to return a function
    const returnFunction = service.handleRedirectRequestError();
    expect(typeof returnFunction).toEqual('function');
    // --- expect the returned function to:
    // return an observable of null
    const mockError = { status: 1 }
    const returnObservable = returnFunction(mockError);
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: null };
      expectObservable(returnObservable).toBe(expectedMarbles, expectedValue);
    });
    // call redirectOnRequestError with the error.status property
    expect(redirect.redirectOnRequestError).toHaveBeenCalledWith(mockError.status);
  });

  it('#handleFrontEndError should subscribe to observable returned by logToApi', () => {
    const logObservable = logService.logToApi(mockFrontEndError);
    const logSubscribeSpy = spyOn(logObservable, 'subscribe').and.callThrough();
    service.handleFrontEndError(mockFrontEndError);
    expect(logService.logToApi).toHaveBeenCalledWith(mockFrontEndError);
    expect(logSubscribeSpy).toHaveBeenCalledTimes(1);
  })

  it('#handleBuiltInError should instantiate frontEndError and subscribe to logToApi observable', () => {
    const mockError = new FrontEndError
    (mockFrontEndError.constructor.name, mockFrontEndError.path, mockFrontEndError.message);
    const logObservable = logService.logToApi(mockError);
    const logSubscribeSpy = spyOn(logObservable, 'subscribe').and.callThrough();
    service.handleBuiltInError(mockFrontEndError, mockFrontEndError.path);
    expect(logService.logToApi).toHaveBeenCalledWith(mockError);
    expect(logSubscribeSpy).toHaveBeenCalledTimes(1);
  })
});
