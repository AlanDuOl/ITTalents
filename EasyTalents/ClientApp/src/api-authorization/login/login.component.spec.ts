import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { mockRouteSnapshotLogin } from '../../app/mock-data';
import { AuthorizeService } from '../authorize.service';

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
    mockRouter = {}
    mockActivatedRoute = {
      snapshot: mockRouteSnapshotLogin
    }
    mockAuthService = {}
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
