import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { PageLoaderModule } from '../../page-loader/page-loader.module';
import { ListComponent } from './list.component';
import { ProfilesService } from '../../profiles/profiles.service';
import { uiPath, redirectCode, errorType } from '../../constants';
import { mockProfileList } from '../../mock-data';
import { ErrorService } from 'src/app/error.service';
import { FrontEndError } from 'src/app/modeldata';
import { ProfileList } from 'src/app/profiles/model-data';
import { TestScheduler } from 'rxjs/testing';


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockError: Partial<ErrorService>;
  let error: ErrorService;
  let mockService: Partial<ProfilesService>;
  let service: ProfilesService;
  let mockRouter: Partial<Router>;
  let router: Router;
  let componentElement: HTMLElement;
  let scheduler: TestScheduler;

  beforeEach(async(() => {
    mockService = {
      fetchProfileList(): Observable<ProfileList[]> { return of([mockProfileList]) },
    };
    mockRouter = { navigate: jasmine.createSpy('navigate').and.callThrough() };
    mockError = { 
      handleFrontEndError: jasmine.createSpy('handleFrontEndError').and.callThrough(),
      handleRedirectRequestError: jasmine.createSpy('handleRedirectRequestError').and
        .returnValue(() => of(null))
    }
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterModule.forRoot([]),
        PageLoaderModule,
        HttpClientModule
      ],
      providers: [
        { provide: ProfilesService, useValue: mockService },
        { provide: Router, useValue: mockRouter },
        { provide: ErrorService, useValue: mockError }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ProfilesService);
    router = fixture.debugElement.injector.get(Router);
    error = fixture.debugElement.injector.get(ErrorService);
    componentElement = fixture.debugElement.nativeElement;
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set profiles$', fakeAsync(() => {
    spyOn(service, 'fetchProfileList').and.callThrough();
    component.profiles$ = null;
    component.ngOnInit();
    tick();
    expect(component.profiles$).not.toBeNull('should not be null');
  }));

  it('#profiles$ should emit the expected data', () => {
    scheduler.run(({ expectObservable }) => {
        const returnObservable: Observable<ProfileList[]> = service.fetchProfileList();
        const expectedMarbles = '(a|)';
        const expectedValue = { a: null };
        returnObservable.subscribe(res => expectedValue.a = res);
        expectObservable(component.profiles$).toBe(expectedMarbles, expectedValue)
    })
  })
  
  it('Observable error will be handled in catchError', () => {
    // change fetchProfileList to return an error observable
    spyOn(service, 'fetchProfileList').and.returnValue(throwError('error'));
    // the error will be handled by redirectOnRequestError that will return an observable
    // that emits null
    // call ngOnInit again to reset profiles$ with the error observable
    component.ngOnInit();
    // since profiles$ is set to the value of fetchProfileList call,
    // a subscription to profiles$ emits a null value
    component.profiles$.subscribe(
      val => {
          expect(val).toBeNull('val should be null on error');
      },
    )
  });

  it('Observable error should load page-loader', () => {
    // create fetchProfileList that will return and error observable
    spyOn(service, 'fetchProfileList').and.returnValue(throwError('error'));
    let listPage: any;
    let loaderPage: any;
    // running ngOnInit with a valid profiles$ value loads the listPage
    // but not the loaderPage
    listPage = componentElement.querySelector('.list-container');
    loaderPage = componentElement.querySelector('.loader-view');
    expect(listPage).not.toBeNull();
    expect(loaderPage).toBeNull();
    // running ngOnInit again with the new value of getProfileById will make profiles$ emit null.
    // this will make listPage be null and loaderPage not
    component.ngOnInit();
    fixture.detectChanges();
    listPage = componentElement.querySelector('.list-container');
    loaderPage = componentElement.querySelector('.loader-view');
    expect(listPage).toBeNull();
    expect(loaderPage).not.toBeNull();
  });

  it('#goToDetailsById should call #router.navigate based on argument', () => {
    const expectedPath1 = [uiPath.admin.profileDetails, mockProfileList.id];
    const expectedPath2 = [uiPath.error, redirectCode.notFound];
    const mockError = new FrontEndError(errorType.nullArgument, 'list-component goToDetailsById');
    let localProfileList = Object.assign({}, mockProfileList);
    // test case 1: valid value for profile list
    component.goToDetailsById(localProfileList);
    expect(router.navigate).toHaveBeenCalledWith(expectedPath1);
    expect(router.navigate).not.toHaveBeenCalledWith(expectedPath2);
    expect(error.handleFrontEndError).not.toHaveBeenCalledWith(mockError);
    // test case 2: profiles list null
    localProfileList = null;
    component.goToDetailsById(localProfileList);
    expect(router.navigate).toHaveBeenCalledWith(expectedPath2);
    expect(error.handleFrontEndError).toHaveBeenCalledWith(mockError);
  });

  it('click on list-element should call #goToDetailsById with profile', fakeAsync(() => {
    spyOn(component, 'goToDetailsById').and.callThrough();
    const profileElement = componentElement.querySelector('.list-element');
    const clickEvent = new Event('click');
    expect(component.goToDetailsById).not.toHaveBeenCalled();
    profileElement.dispatchEvent(clickEvent);
    tick();
    expect(component.goToDetailsById).toHaveBeenCalledWith(mockProfileList);
  }))

  it('list-element should have profiles$ values', () => {
    const profileElement = componentElement.querySelector('.list-element');
    const profileChildren = profileElement.children;
    expect(profileChildren[0].textContent).toBe(mockProfileList.id.toString(), 'id to equal profiles$.id');
    expect(profileChildren[1].textContent).toBe(mockProfileList.name.toString(), 'name to equal profiles$.name');
    expect(profileChildren[2].textContent).toBe(mockProfileList.email.toString(), 'email to equal profiles$.email');
    expect(profileChildren[3].textContent).toBe(mockProfileList.phone.toString(), 'phone to equal profiles$.phone');
  })
});
