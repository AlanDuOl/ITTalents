import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizeService } from '../authorize.service';
import { mockRouteSnapshotLogout } from '../../app/mock-data';

import { LogoutComponent } from './logout.component';

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
    mockAuthService = {}
    mockActivedRoute = {
      snapshot: mockRouteSnapshotLogout
    }
    mockRouter = {}
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
