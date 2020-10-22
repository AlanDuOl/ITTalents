import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { LogService } from './log.service';
import { FrontEndError } from './modeldata';
import { apiPath } from './constants';
import { mockBaseUrl } from './mock-data';

describe('LogService', () => {
  let service: LogService;
  let mockHttp: Partial<HttpClient>;
  let http: HttpClient;
  let baseUrl: any;

  beforeEach(() => {
    mockHttp = { post: jasmine.createSpy('post').and.returnValue(of('test')) }
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttp },
        { provide: 'BASE_URL', useValue: mockBaseUrl }
      ]
    });
    service = TestBed.get(LogService);
    http = TestBed.get(HttpClient);
    baseUrl = TestBed.get('BASE_URL');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#logToApi should return an observable', () => {
    const mockError = new FrontEndError('error type', 'error path', 'error message');
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const mockUrl = `${baseUrl}${apiPath.error}`;
    const returnObservable = service.logToApi(mockError);
    const expectedObservable = http.post(mockUrl, mockError, httpOptions);
    expect(returnObservable).toEqual(expectedObservable, 'return observable should be equal to expected')
  });
});
