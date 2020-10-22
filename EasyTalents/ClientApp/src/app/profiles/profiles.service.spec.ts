import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { HttpClient } from '@angular/common/http';
import { ProfilesService } from './profiles.service';
import { ErrorService } from '../error.service';
import { TechnologyService } from '../technologies/technology.service';
import { WorkingHoursService } from '../working-hours/working-hours.service';
import { WorkingShiftsService } from '../working-shifts/working-shifts.service';
import { ProfessionalInformationService
} from '../professional-information/professional-information.service';
import { Observable, of, throwError } from 'rxjs';
import { mockTechnology, mockWorkingHours, mockWorkingShift, mockInformation,
mockRequestError, mockProfileSubmit, mockSubmitResult, mockProfileList, mockBaseUrl, mockProfile,
mockControls } from '../mock-data';
import { DailyWorkingHours, FrontEndError, ProfessionalInformation, Technology, WorkingShift 
} from '../modeldata';
import { apiPath, errorType, profileSession } from '../constants';
import { FormGroup } from '@angular/forms';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let scheduler: TestScheduler;
  let mockHttp: Partial<HttpClient>;
  let http: HttpClient;
  let mockErrorService: Partial<ErrorService>;
  let error: ErrorService;
  let mockTech: Partial<TechnologyService>;
  let tech: TechnologyService;
  let mockWHours: Partial<WorkingHoursService>;
  let workingHours: WorkingHoursService;
  let mockWShifts: Partial<WorkingShiftsService>;
  let workingShifts: WorkingShiftsService;
  let mockProfessionalInfo: Partial<ProfessionalInformationService>;
  let professionalInfo: ProfessionalInformationService;

  beforeEach(() => {
    mockHttp = {
      post(): Observable<any> { return of(null) },
      put(): Observable<any> { return of(null) },
      get(): Observable<any> { return of(null) },
      delete(): Observable<any> { return of(null) }
    };
    mockErrorService = {
      logRethrowObservableRequestError: jasmine.createSpy('logRethrowObservableRequestError').and
        .callFake(() => { return (error: any) => { throw error } }),
      handleFrontEndError: jasmine.createSpy('handleFrontEndError').and.callFake(() => {}),
      handleBuiltInError: jasmine.createSpy('handleBuiltInError').and.callFake(() => {})
    };
    mockTech = { fetch(): Observable<Technology[]> { return of([mockTechnology]) } };
    mockWHours = { fetch(): Observable<DailyWorkingHours[]> { return of([mockWorkingHours]) } };
    mockWShifts = { fetch(): Observable<WorkingShift[]> { return of([mockWorkingShift]) } };
    mockProfessionalInfo = {
      fetch(): Observable<ProfessionalInformation[]> { return of([mockInformation]) }
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: 'BASE_URL', useValue: mockBaseUrl },
        { provide: HttpClient, useValue: mockHttp },
        { provide: ErrorService, useValue: mockErrorService },
        { provide: TechnologyService, useValue: mockTech },
        { provide: WorkingHoursService, useValue: mockWHours },
        { provide: WorkingShiftsService, useValue: mockWShifts },
        { provide: ProfessionalInformationService, useValue: mockProfessionalInfo },
      ]
    });
  });
  
  beforeEach(() => {
    service = TestBed.get(ProfilesService);
    http = TestBed.get(HttpClient);
    error = TestBed.get(ErrorService);
    tech = TestBed.get(TechnologyService);
    workingHours = TestBed.get(WorkingHoursService);
    workingShifts = TestBed.get(WorkingShiftsService);
    professionalInfo = TestBed.get(ProfessionalInformationService);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- request methods ---

  it('#createProfile should return an Observable that emits the expected data', () => {
    const expectedUrl = `${mockBaseUrl}${apiPath.profile.create}`;
    const expectedError = new FrontEndError(errorType.observable, 'profiles-service createProfile');
    spyOn(http, 'post').and.returnValues(of(mockSubmitResult), throwError(mockRequestError));
    // should call http.post with path, data, httpOptions
    // successObservable must emit mock data
    // errorObservable must resolve to error
    // case 1: observable success
    const successObservable = service.createProfile(mockProfileSubmit);
    expect(error.logRethrowObservableRequestError).toHaveBeenCalledWith(expectedError);
    expect(http.post).toHaveBeenCalledWith(expectedUrl, mockProfileSubmit, service.getHttpOptions());
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: mockSubmitResult };
      expectObservable(successObservable).toBe(expectedMarbles, expectedValue);
    });
    // case 2: observable error
    const errorObservable = service.createProfile(mockProfileSubmit);
    errorObservable.subscribe(
      () => {
        expect(true).toBe(false);
      },
      err => {
        expect(err).toEqual(mockRequestError);
      }
    );
  });

  it('#updateProfile should return an Observable that emits the expected data', () => {
    const expectedUrl = `${mockBaseUrl}${apiPath.profile.update}`;
    const expectedError = new FrontEndError(errorType.observable, 'profiles-service updateProfile');
    spyOn(http, 'put').and.returnValues(of(mockSubmitResult), throwError(mockRequestError));
    // should call http.put with path, data, httpOptions
    // successObservable must emit mock data
    // errorObservable must resolve to error
    // case 1: observable success
    const successObservable = service.updateProfile(mockProfileSubmit);
    expect(error.logRethrowObservableRequestError).toHaveBeenCalledWith(expectedError);
    expect(http.put).toHaveBeenCalledWith(expectedUrl, mockProfileSubmit, service.getHttpOptions());
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: mockSubmitResult };
      expectObservable(successObservable).toBe(expectedMarbles, expectedValue);
    });
    // case 2: observable error
    const errorObservable = service.updateProfile(mockProfileSubmit);
    errorObservable.subscribe(
      () => {
        expect(true).toBe(false);
      },
      err => {
        expect(err).toEqual(mockRequestError);
      }
    );
  });

  it('#deleteProfile should return an Observable that emits the expected data', () => {
    const expectedUrl = `${mockBaseUrl}${apiPath.profile.delete}`;
    const expectedError = new FrontEndError(errorType.observable, 'profiles-service deleteProfile');
    spyOn(http, 'delete').and.returnValues(of(mockSubmitResult), throwError(mockRequestError));
    // should call http.delete with path, httpOptions
    // successObservable must emit mock data
    // errorObservable must resolve to error
    // case 1: observable success
    const successObservable = service.deleteProfile();
    expect(error.logRethrowObservableRequestError).toHaveBeenCalledWith(expectedError);
    expect(http.delete).toHaveBeenCalledWith(expectedUrl, service.getHttpOptions());
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: mockSubmitResult };
      expectObservable(successObservable).toBe(expectedMarbles, expectedValue);
    });
    // case 2: observable error
    const errorObservable = service.deleteProfile();
    errorObservable.subscribe(
      () => {
        expect(true).toBe(false);
      },
      err => {
        expect(err).toEqual(mockRequestError);
      }
    );
  });

  it('#deleteProfileById should return an Observable that emits the expected data', () => {
    const fakeId = 1;
    const expectedUrl = `${mockBaseUrl}${apiPath.profile.delete}/${fakeId}`;
    const expectedError = new FrontEndError(errorType.observable, 'profiles-service deleteProfileById');
    spyOn(http, 'delete').and.returnValues(of(mockSubmitResult), throwError(mockRequestError));
    // should call http.delete with path, httpOptions
    // successObservable must emit mock data
    // errorObservable must resolve to error
    // case 1: observable success
    const successObservable = service.deleteProfileById(fakeId);
    expect(error.logRethrowObservableRequestError).toHaveBeenCalledWith(expectedError);
    expect(http.delete).toHaveBeenCalledWith(expectedUrl, service.getHttpOptions());
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: mockSubmitResult };
      expectObservable(successObservable).toBe(expectedMarbles, expectedValue);
    });
    // case 2: observable error
    const errorObservable = service.deleteProfileById(fakeId);
    errorObservable.subscribe(
      () => {
        expect(true).toBe(false);
      },
      err => {
        expect(err).toEqual(mockRequestError);
      }
    );
  });

  it('#fetchProfileList should return an Observable that emits the expected data', () => {
    const expectedUrl = `${mockBaseUrl}${apiPath.admin.list}`;
    const expectedError = new FrontEndError(errorType.observable, 'profiles-service fetchProfileList');
    spyOn(http, 'get').and.returnValues(of([mockProfileList]), throwError(mockRequestError));
    // should call http.delete with path, httpOptions
    // successObservable must emit mock data
    // errorObservable must resolve to error
    // case 1: observable success
    const successObservable = service.fetchProfileList();
    expect(error.logRethrowObservableRequestError).toHaveBeenCalledWith(expectedError);
    expect(http.get).toHaveBeenCalledWith(expectedUrl);
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: [mockProfileList] };
      expectObservable(successObservable).toBe(expectedMarbles, expectedValue);
    });
    // case 2: observable error
    const errorObservable = service.fetchProfileList();
    errorObservable.subscribe(
      () => {
        expect(true).toBe(false);
      },
      err => {
        expect(err).toEqual(mockRequestError);
      }
    );
  });

  it('#getProfileById should return an Observable that emits the expected data', () => {
    const fakeId = 1;
    const expectedUrl = `${mockBaseUrl}${apiPath.admin.get}/${fakeId}`;
    const expectedError = new FrontEndError(errorType.observable, 'profiles-service getProfileById');
    spyOn(http, 'get').and.returnValues(of(mockProfile), throwError(mockRequestError));
    // should call http.delete with path, httpOptions
    // successObservable must emit mock data
    // errorObservable must resolve to error
    // case 1: observable success
    const successObservable = service.getProfileById(fakeId);
    expect(error.logRethrowObservableRequestError).toHaveBeenCalledWith(expectedError);
    expect(http.get).toHaveBeenCalledWith(expectedUrl);
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: mockProfile };
      expectObservable(successObservable).toBe(expectedMarbles, expectedValue);
    });
    // case 2: observable error
    const errorObservable = service.getProfileById(fakeId);
    errorObservable.subscribe(
      () => {
        expect(true).toBe(false);
      },
      err => {
        expect(err).toEqual(mockRequestError);
      }
    );
  });

  it('#fetchProfile should return an Observable that emits the expected data', () => {
    const expectedUrl = `${mockBaseUrl}${apiPath.profile.get}`;
    const expectedError = new FrontEndError(errorType.observable, 'profiles-service fetchProfile');
    spyOn(http, 'get').and.returnValues(of(mockProfile), throwError(mockRequestError));
    // should call http.delete with path, httpOptions
    // successObservable must emit mock data
    // errorObservable must resolve to error
    // case 1: observable success
    const successObservable = service.fetchProfile();
    expect(error.logRethrowObservableRequestError).toHaveBeenCalledWith(expectedError);
    expect(http.get).toHaveBeenCalledWith(expectedUrl);
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: mockProfile };
      expectObservable(successObservable).toBe(expectedMarbles, expectedValue);
    });
    // case 2: observable error
    const errorObservable = service.fetchProfile();
    errorObservable.subscribe(
      () => {
        expect(true).toBe(false);
      },
      err => {
        expect(err).toEqual(mockRequestError);
      }
    );
  });

  // ---- utils methods ----
  it('#userHasProfile should return true or false', () => {
    // case 1: should return false
    sessionStorage.removeItem(profileSession.item);
    let result = service.userHasProfile();
    expect(!!result).toBe(false);
    // case 2: should return true
    sessionStorage.setItem(profileSession.item, profileSession.value);
    result = service.userHasProfile();
    expect(!!result).toBe(true);
  });

  it('#setUserProfile should set user in sessionStorage', () => {
    spyOn(http, 'get').and.returnValues(of(mockProfile), of(null), throwError(mockRequestError));
    let result: string;
    // case 1: fetchProfile returns valid response
    sessionStorage.removeItem(profileSession.item);
    service.setUserProfile();
    result = sessionStorage.getItem(profileSession.item);
    expect(result).toBe(profileSession.value);
    // case 2: fetchProfile returns null response
    sessionStorage.removeItem(profileSession.item);
    service.setUserProfile();
    result = sessionStorage.getItem(profileSession.item);
    expect(result).toBe('');
    // case 3: fetchProfile returns error
    sessionStorage.removeItem(profileSession.item);
    service.setUserProfile();
    result = sessionStorage.getItem(profileSession.item);
    expect(result).toBe('');
  });

  it('#getCreateData should fetch db data and return an observable of FormGroup', () => {
    spyOn(tech, 'fetch').and.callThrough();
    spyOn(workingHours, 'fetch').and.callThrough();
    spyOn(workingShifts, 'fetch').and.callThrough();
    spyOn(professionalInfo, 'fetch').and.callThrough();
    let currentData = service.getFetchedData();
    const returnObservable = service.getCreateData();
    // calling #getCreateData calls the spy functions but does not set the data
    // fetch services should be called
    expect(currentData.technologies).not.toEqual([mockTechnology]);
    expect(currentData.workingHours).not.toEqual([mockWorkingHours]);
    expect(currentData.workingShifts).not.toEqual([mockWorkingShift]);
    expect(currentData.professionalInformation).not.toEqual([mockInformation]);
    expect(tech.fetch).toHaveBeenCalled();
    expect(workingHours.fetch).toHaveBeenCalled();
    expect(workingShifts.fetch).toHaveBeenCalled();
    expect(professionalInfo.fetch).toHaveBeenCalled();
    // subscribing to the observable sets the data
    returnObservable.subscribe();
    currentData = service.getFetchedData();
    // should set fetchedData.technologies & .workingShifts & .workingHours & .professionalInformation
    expect(currentData.technologies).toEqual([mockTechnology]);
    expect(currentData.workingHours).toEqual([mockWorkingHours]);
    expect(currentData.workingShifts).toEqual([mockWorkingShift]);
    expect(currentData.professionalInformation).toEqual([mockInformation]);
    expect(currentData.profile).toBeNull();
  });

  it('#getCreateData should emit the expected data', () => {
    // case 1: success result
    let returnObservable = service.getCreateData();
    returnObservable.subscribe(res => {
      expect(res instanceof FormGroup).toBe(true);
      expect(res).not.toBeNull();
    })
    // case 2: error in fetch
    // should emit error
    spyOn(tech, 'fetch').and.returnValues(throwError(mockRequestError), of([null]));
    returnObservable = service.getCreateData();
    returnObservable.subscribe(
      () => {
        expect(true).toBe(false)
      },
      (err: any) => {
        expect(err).toEqual(mockRequestError);
      }
    );
    // case 3: a fetch returns not valid data or #setControls returns null
    // should emit null
    returnObservable = service.getCreateData();
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValues = { a: null };
      expectObservable(returnObservable).toBe(expectedMarbles, expectedValues);
    })
  });

  it('#getUpdateData should fetch db data and return an observable of FormGroup', () => {
    spyOn(tech, 'fetch').and.callThrough();
    spyOn(workingHours, 'fetch').and.callThrough();
    spyOn(workingShifts, 'fetch').and.callThrough();
    spyOn(professionalInfo, 'fetch').and.callThrough();
    spyOn(service, 'fetchProfile').and.returnValue(of(mockProfile));
    let currentData = service.getFetchedData();
    const returnObservable = service.getUpdateData();
    // calling #getUpdateData calls the spy functions but does not set the data
    // fetch services should be called
    expect(currentData.technologies).not.toEqual([mockTechnology]);
    expect(currentData.workingHours).not.toEqual([mockWorkingHours]);
    expect(currentData.workingShifts).not.toEqual([mockWorkingShift]);
    expect(currentData.professionalInformation).not.toEqual([mockInformation]);
    expect(currentData.profile).not.toEqual(mockProfile);
    expect(tech.fetch).toHaveBeenCalled();
    expect(workingHours.fetch).toHaveBeenCalled();
    expect(workingShifts.fetch).toHaveBeenCalled();
    expect(professionalInfo.fetch).toHaveBeenCalled();
    expect(service.fetchProfile).toHaveBeenCalled();
    // subscribing to the observable sets the data
    returnObservable.subscribe();
    currentData = service.getFetchedData();
    // should set fetchedData.technologies & .workingShifts & .workingHours & .professionalInformation
    expect(currentData.technologies).toEqual([mockTechnology]);
    expect(currentData.workingHours).toEqual([mockWorkingHours]);
    expect(currentData.workingShifts).toEqual([mockWorkingShift]);
    expect(currentData.professionalInformation).toEqual([mockInformation]);
    expect(currentData.profile).toEqual(mockProfile);
  });

  it('#getUpdateData should emit the expected data', () => {
    // case 1: success result
    spyOn(service, 'fetchProfile').and.returnValue(of(mockProfile));
    let returnObservable = service.getUpdateData();
    returnObservable.subscribe(res => {
      expect(res instanceof FormGroup).toBe(true);
      expect(res).not.toBeNull();
    })
    // case 2: error in fetch
    // should emit error
    spyOn(tech, 'fetch').and.returnValues(throwError(mockRequestError), of([null]));
    returnObservable = service.getUpdateData();
    returnObservable.subscribe(
      () => {
        expect(true).toBe(false)
      },
      (err: any) => {
        expect(err).toEqual(mockRequestError);
      }
    );
    // case 3: a fetch returns not valid data or #setControls returns null
    // should emit null
    returnObservable = service.getUpdateData();
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValues = { a: null };
      expectObservable(returnObservable).toBe(expectedMarbles, expectedValues);
    })
  });

  it('#formControls should have the expected data: update', () => {
    // case 1: success result
    spyOn(service, 'fetchProfile').and.returnValue(of(mockProfile));
    let returnObservable = service.getUpdateData();
    returnObservable.subscribe(
      res => {
        // pages
        expect(res.get('page0')).not.toBeNull();
        expect(res.get('page1')).not.toBeNull();
        expect(res.get('page2')).not.toBeNull();
        // controls page0
        expect(res.get('page0').get('name').value).toBe(mockProfile.name);
        expect(res.get('page0').get('email').value).toBe(mockProfile.email);
        expect(res.get('page0').get('phone').value).toBe(mockProfile.phone);
        expect(res.get('page0').get('city').value).toBe(mockProfile.location.city);
        expect(res.get('page0').get('state').value).toBe(mockProfile.location.state);
        // controls page1
        expect(res.get('page1').get('hourlySalary').value).toBe(mockProfile.hourlySalary);
        expect(res.get('page1').get('professionalInformation').get('skype').value)
          .toBe(mockProfile.userProfessionalInformation[0].value);
        expect(res.get('page1').get('professionalInformation').get('linkedin')).toBeNull();
        expect(res.get('page1').get('professionalInformation').get('portfolio')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily1').value)
          .toBe(!!mockProfile.userDailyWorkingHours[0]);
        expect(res.get('page1').get('dailyWorkingHours').get('daily2')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily3')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily4')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily5')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('morning').value)
          .toBe(!!mockProfile.userWorkingShifts[0]);
        expect(res.get('page1').get('workingShifts').get('afternoon')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('dawn')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('night')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('business')).toBeNull();
        // controls page2
        expect(res.get('page2').get('linkCrud').value).toBe('');
        expect(res.get('page2').get('otherTechnology').value).toBe('');
        expect(res.get('page2').get('technologies').get('tech1').value)
          .toBe(mockProfile.userTechnologies[0].score.toString());
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#formControls should have the expected data: create', () => {
    let returnObservable = service.getCreateData();
    returnObservable.subscribe(
      res => {
        // pages
        expect(res.get('page0')).not.toBeNull();
        expect(res.get('page1')).not.toBeNull();
        expect(res.get('page2')).not.toBeNull();
        // controls page0
        expect(res.get('page0').get('name').value).toBe('');
        expect(res.get('page0').get('email').value).toBe('');
        expect(res.get('page0').get('phone').value).toBe('');
        expect(res.get('page0').get('city').value).toBe('');
        expect(res.get('page0').get('state').value).toBe('');
        // controls page1
        expect(res.get('page1').get('hourlySalary').value).toBe('');
        expect(res.get('page1').get('professionalInformation').get('skype').value)
          .toBe('');
        expect(res.get('page1').get('professionalInformation').get('linkedin')).toBeNull();
        expect(res.get('page1').get('professionalInformation').get('portfolio')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily1').value)
          .toBe(false);
        expect(res.get('page1').get('dailyWorkingHours').get('daily2')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily3')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily4')).toBeNull();
        expect(res.get('page1').get('dailyWorkingHours').get('daily5')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('morning').value)
          .toBe(false);
        expect(res.get('page1').get('workingShifts').get('afternoon')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('dawn')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('night')).toBeNull();
        expect(res.get('page1').get('workingShifts').get('business')).toBeNull();
        // controls page2
        expect(res.get('page2').get('linkCrud').value).toBe('');
        expect(res.get('page2').get('otherTechnology').value).toBe('');
        expect(res.get('page2').get('technologies').get('tech1').value)
          .toBe('');
      },
      () => {
        expect(true).toBe(false);
      }
    );
  });

  it('#getSubmitData should create ProfileSubmit object: update', () => {
    // arrange
    spyOn(service, 'fetchProfile').and.returnValue(of(mockProfile));
    let controls = new FormGroup({});
    Object.assign(controls, mockControls);
    // page0
    controls.get('page0').get('name').setValue('alan');
    controls.get('page0').get('email').setValue('alan@abc.com');
    controls.get('page0').get('phone').setValue('123456789');
    controls.get('page0').get('city').setValue('new york');
    controls.get('page0').get('state').setValue('acre');
    // page1
    controls.get('page1').get('hourlySalary').setValue(20);
    controls.get('page1').get('professionalInformation').get('skype').setValue('myskype.com');
    controls.get('page1').get('dailyWorkingHours').get('daily1').setValue(true);
    controls.get('page1').get('workingShifts').get('morning').setValue(true);
    // page2
    controls.get('page2').get('linkCrud').setValue('mycrud.com');
    controls.get('page2').get('otherTechnology').setValue('faketech score 4');
    controls.get('page2').get('technologies').get('tech1').setValue(4);
    // act
    // to fetch the data needed for creating submit data
    service.getUpdateData().subscribe();
    const submitData = service.getSubmitData(controls);

    // assert
    // page0
    expect(submitData.profileId).toBe(mockProfileSubmit.profileId);
    expect(submitData.name).toBe(controls.get('page0').get('name').value);
    expect(submitData.email).toBe(controls.get('page0').get('email').value);
    expect(submitData.phone).toBe(controls.get('page0').get('phone').value);
    expect(submitData.location.city).toBe(controls.get('page0').get('city').value);
    expect(submitData.location.state).toBe(controls.get('page0').get('state').value);
    // page1
    expect(submitData.hourlySalary).toBe(controls.get('page1').get('hourlySalary').value);
    expect(submitData.professionalInformation[0].id)
      .toBe(mockInformation.professionalInformationId);
    expect(submitData.professionalInformation[0].value)
      .toBe(controls.get('page1').get('professionalInformation').get('skype').value);
    expect(submitData.workingHoursIds[0]).toBe(mockWorkingHours.dailyWorkingHoursId);
    expect(submitData.workingShiftIds[0]).toBe(mockWorkingShift.workingShiftId);
    // page2
    expect(submitData.technologies[0].id).toBe(mockTechnology.technologyId);
    expect(submitData.technologies[0].score)
      .toBe(controls.get('page2').get('technologies').get('tech1').value);
  });

  it('#getSubmitData should create ProfileSubmit object: update', () => {
    // the only diference from update is that profileSubmit profileId should be undefined
    // arrange
    let controls = new FormGroup({});
    Object.assign(controls, mockControls);
    // page0
    controls.get('page0').get('name').setValue('alan');
    controls.get('page0').get('email').setValue('alan@abc.com');
    controls.get('page0').get('phone').setValue('123456789');
    controls.get('page0').get('city').setValue('new york');
    controls.get('page0').get('state').setValue('acre');
    // page1
    controls.get('page1').get('hourlySalary').setValue(20);
    controls.get('page1').get('professionalInformation').get('skype').setValue('myskype.com');
    controls.get('page1').get('dailyWorkingHours').get('daily1').setValue(true);
    controls.get('page1').get('workingShifts').get('morning').setValue(true);
    // page2
    controls.get('page2').get('linkCrud').setValue('mycrud.com');
    controls.get('page2').get('otherTechnology').setValue('faketech score 4');
    controls.get('page2').get('technologies').get('tech1').setValue(4);
    // act
    // to fetch the data needed for creating submit data
    service.getCreateData().subscribe();
    const submitData = service.getSubmitData(controls);

    // assert
    // page0
    expect(submitData.profileId).toBe(undefined);
    expect(submitData.name).toBe(controls.get('page0').get('name').value);
    expect(submitData.email).toBe(controls.get('page0').get('email').value);
    expect(submitData.phone).toBe(controls.get('page0').get('phone').value);
    expect(submitData.location.city).toBe(controls.get('page0').get('city').value);
    expect(submitData.location.state).toBe(controls.get('page0').get('state').value);
    // page1
    expect(submitData.hourlySalary).toBe(controls.get('page1').get('hourlySalary').value);
    expect(submitData.professionalInformation[0].id)
      .toBe(mockInformation.professionalInformationId);
    expect(submitData.professionalInformation[0].value)
      .toBe(controls.get('page1').get('professionalInformation').get('skype').value);
    expect(submitData.workingHoursIds[0]).toBe(mockWorkingHours.dailyWorkingHoursId);
    expect(submitData.workingShiftIds[0]).toBe(mockWorkingShift.workingShiftId);
    // page2
    expect(submitData.technologies[0].id).toBe(mockTechnology.technologyId);
    expect(submitData.technologies[0].score)
      .toBe(controls.get('page2').get('technologies').get('tech1').value);
  });
});
