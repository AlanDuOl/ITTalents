import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { mockRouteSnapshotLogin } from '../../app/mock-data';
import { AuthorizeService } from '../authorize.service';
import { AuthenticationResultStatus } from '../authorize.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let activatedRoute: ActivatedRoute;
  let mockAuthService: Partial<AuthorizeService>;
  let authorizeService: AuthorizeService;

  beforeEach(async(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {}),
      navigateByUrl: jasmine.createSpy('navigateByUrl').and.callFake(() => {}),
    }
    mockActivatedRoute = {
      snapshot: mockRouteSnapshotLogin
    }
    mockAuthService = {
      signIn: jasmine.createSpy('signIn').and
      .returnValue({ status: AuthenticationResultStatus.Success, state: '' }),
      completeSignIn: jasmine.createSpy('completeSignIn').and
      .returnValue({ status: AuthenticationResultStatus.Success, state: '' })
    }
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AuthorizeService, useValue: mockAuthService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    authorizeService = fixture.debugElement.injector.get(AuthorizeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
