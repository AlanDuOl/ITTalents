import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ProfessionalInformationService } from './professional-information.service';
import { of, throwError } from 'rxjs';
import { FrontEndError } from '../modeldata';
import { mockInformation, mockBaseUrl } from '../mock-data';
import { ErrorService } from '../error.service';
import { TestScheduler } from 'rxjs/testing';
import { apiPath } from '../constants';

describe('ProfessionalInformationService', () => {
  let mockHttp: Partial<HttpClient>;
  let http: HttpClient;
  let mockErrorService: Partial<ErrorService>;
  let error: ErrorService;
  let service: ProfessionalInformationService;
  let baseUrl: any;
  let scheduler: TestScheduler;

  beforeEach(() => {
    mockHttp = { 
      get: jasmine.createSpy('get').and.returnValues(of([mockInformation]), throwError('error'))
    }
    mockErrorService = {
      logRethrowObservableRequestError: jasmine.createSpy('logRethrowObservableRequestError')
        .and.returnValue(function (error: any) { throw error; })
    }
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
        { provide: ErrorService, useValue: mockErrorService },
        { provide: 'BASE_URL', useValue: mockBaseUrl }
      ]
    })
    service = TestBed.get(ProfessionalInformationService);
    http = TestBed.get(HttpClient);
    error = TestBed.get(ErrorService);
    baseUrl = TestBed.get('BASE_URL');
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#fetch should call #logRethrowObservableRequestError', () => {
    expect(error.logRethrowObservableRequestError).not.toHaveBeenCalled();
    service.fetch();
    expect(error.logRethrowObservableRequestError).toHaveBeenCalled();
  });

  it('#fetch should call http get with params', () => {
    const expectedParams = `${baseUrl}${apiPath.professionalInformation}`;
    service.fetch();
    expect(http.get).toHaveBeenCalledWith(expectedParams);
  });

  it('#fetched observable should emit expected values', () => {
    // first call to #fetch will return a valid observable
    const validObservable = service.fetch();
    // second call to #fetch will return an error observable
    const errorObservable = service.fetch();
    // assert for expected value in valid observable
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: [mockInformation] };
      expectObservable(validObservable).toBe(expectedMarbles, expectedValue)
    })
    // assert for error in error observable
    errorObservable.subscribe(
      () => {
        // this should not run
        expect(true).toBe(false);
      },
      err => {
        expect(!!err).toBe(true, 'error should be thrown');
      }
    )
  });
});
