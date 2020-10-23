import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthorizeService } from '../authorize.service';
import { LoginMenuComponent } from './login-menu.component';

describe('LoginMenuComponent', () => {
  let component: LoginMenuComponent;
  let fixture: ComponentFixture<LoginMenuComponent>;
  let element: HTMLElement;
  let mockAuthService: Partial<AuthorizeService>;
  let authorizeService: AuthorizeService;
  let testScheduler: TestScheduler;
  const fakeUser = {
    name: 'user1'
  }

  beforeEach(async(() => {
    mockAuthService = {
        isAuthenticated(): Observable<boolean> { return of(true) },
        getUser: jasmine.createSpy('getUser').and.returnValue(of(fakeUser))
    }
    TestBed.configureTestingModule({
      declarations: [ LoginMenuComponent ],
      imports: [
          RouterModule.forRoot([])
      ],
      providers: [
        { provide: AuthorizeService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMenuComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    authorizeService = fixture.debugElement.injector.get(AuthorizeService);
    testScheduler = new TestScheduler((expected, actual) => {
        expect(expected).toEqual(actual);
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set #isAuthenticated and #userName', () => {
    // arrange
    let expectedUserName = 'user1';
    let expectedIsAuthenticated = true;
    component.isAuthenticated = of(false);
    component.userName = of('nouser');

    // act
    component.ngOnInit();
    // assert 
    testScheduler.run(({ expectObservable }) => {
        const expectedMarbles = "(a|)";
        const expectedValue = { a: expectedIsAuthenticated };
        expectObservable(component.isAuthenticated).toBe(expectedMarbles, expectedValue);
    });
    testScheduler.run(({ expectObservable }) => {
        const expectedMarbles = "(a|)";
        const expectedValue = { a: expectedUserName };
        expectObservable(component.userName).toBe(expectedMarbles, expectedValue);
    });
  });

  it('#template authentication/profiles should contain the expected userName', () => {
    // default user name is 'user1'
    let expectedGreeting = "Hello user1";
    const attrValue = '/authentication/profile';
    let anchor = element.querySelector(`a[href="${attrValue}"`);
    expect(anchor.textContent).toBe(expectedGreeting);
    // change user name to 'user10'
    component.userName = of('user10');
    fixture.detectChanges();
    expectedGreeting = "Hello user10";
    anchor = element.querySelector(`a[href="${attrValue}"`);
    expect(anchor.textContent).toBe(expectedGreeting);
  });

  it('#template should have href to authentication/profiles', () => {
    // case 1: profile should render
    const expectedValue = '/authentication/profile';
    let anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor.getAttribute('href')).toBe(expectedValue);

    // case 2: profile should not render
    component.isAuthenticated = of(false);
    fixture.detectChanges();
    anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor).toBe(null);
  });

  it('#template should have href to /authentication/logout', () => {
    // case 1: logout should render
    const expectedValue = '/authentication/logout';
    let anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor.getAttribute('href')).toBe(expectedValue);

    // case 2: logout should not render
    component.isAuthenticated = of(false);
    fixture.detectChanges();
    anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor).toBe(null);
  });

  it('#template should have href to authentication/profiles', () => {
    // case 1: register should not render
    const expectedValue = '/authentication/register';
    let anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor).toBe(null);

    // case 2: register should render
    component.isAuthenticated = of(false);
    fixture.detectChanges();
    anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor.getAttribute('href')).toBe(expectedValue);
  });

  it('#template should have href to /authentication/logout', () => {
    // case 1: login should not render
    const expectedValue = '/authentication/login';
    let anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor).toBe(null);

    // case 2: login should render
    component.isAuthenticated = of(false);
    fixture.detectChanges();
    anchor = element.querySelector(`a[href="${expectedValue}"`);
    expect(anchor.getAttribute('href')).toBe(expectedValue);
  });
});
