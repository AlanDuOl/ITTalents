import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationResultStatus, AuthorizeService } from '../authorize.service';
import { mockRouteSnapshotLogout } from '../../app/mock-data';

import { LogoutComponent } from './logout.component';
import { of } from 'rxjs';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let mockAuthService: Partial<AuthorizeService>;
  let authorizeService: AuthorizeService;
  let mockActivedRoute: Partial<ActivatedRoute>;
  let activatedRoute: ActivatedRoute;
  let mockRouter: Partial<Router>;
  let router: Router;

  beforeEach(async(() => {
    mockAuthService = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(of(true)),
      signOut: jasmine.createSpy('signOut').and
      .returnValue({ status: AuthenticationResultStatus.Success, message: 'fake message' }),
      completeSignOut: jasmine.createSpy('completeSignOut').and
      .returnValue({
        status: AuthenticationResultStatus.Success,
        state: 'mock',
        message: 'fake message' })
    }
    mockActivedRoute = {
      snapshot: mockRouteSnapshotLogout
    }
    mockRouter = {
      navigate: jasmine.createSpy('navigate').and.callFake(() => {}),
      navigateByUrl: jasmine.createSpy('navigateByUrl').and.callFake(() => {}),
    }
    TestBed.configureTestingModule({
      declarations: [ LogoutComponent ],
      providers: [
        { provide: AuthorizeService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivedRoute },
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    authorizeService = fixture.debugElement.injector.get(AuthorizeService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
