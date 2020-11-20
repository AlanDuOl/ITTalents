import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavMenuComponent } from './nav-menu.component';
import { AppLoginMenuComponent } from '../mock-data';
import { RouterModule } from '@angular/router';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable, of } from 'rxjs';
import { uiPath } from '../constants';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;
  let mockAuth: Partial<AuthorizeService>;
  let auth: AuthorizeService;
  let element: HTMLElement;

  beforeEach(async(() => {
    mockAuth = {
      isAuthenticated(): Observable<boolean> { return of(true); },
      isAuthorized(): Observable<boolean> { return of(true); }
    }
    TestBed.configureTestingModule({
      declarations: [ NavMenuComponent, AppLoginMenuComponent ],
      imports: [
        RouterModule.forRoot([])
      ],
      providers: [
        { provide: AuthorizeService, useValue: mockAuth }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    auth = fixture.debugElement.injector.get(AuthorizeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set #isAuthorized and #isAuthenticated', () => {
    component.isAuthorized$ = null;
    component.isAuthenticated$ = null;
    component.ngOnInit();
    expect(component.isAuthorized$).not.toBeNull('set to a value');
    expect(component.isAuthenticated$).not.toBeNull('set to a value');
  });

  it('#auth.isAuthorized should be called with param', () => {
    spyOn(auth, 'isAuthorized').and.callThrough();
    const expectedParam = ['Admin'];
    expect(auth.isAuthorized).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(auth.isAuthorized).toHaveBeenCalledWith(expectedParam);
  });

  it('#collapse should set #isExpanded to false', () => {
    component.isExpanded = true;
    component.collapse();
    expect(component.isExpanded).toBe(false, 'after calling #collapse');
  });

  it('#toggle should set isExpanded to !currentValue', () => {
    component.isExpanded = true;
    component.toggle();
    expect(component.isExpanded).toBe(false, 'after calling #toggle');
    component.toggle();
    expect(component.isExpanded).toBe(true, 'after calling #toggle');
  });

  it('#click on #navbar-toggler should call #toggle', () => {
    spyOn(component, 'toggle');
    const togglerBtn = element.querySelector('.navbar-toggler');
    const clickEvent = new Event('click');
    // assertions
    expect(component.toggle).not.toHaveBeenCalled();
    togglerBtn.dispatchEvent(clickEvent);
    expect(component.toggle).toHaveBeenCalled();
  });

  it('#isAuthenticated === true should show non-auth menus', () => {
    const userNavEl = element.querySelector('.user-nav');
    // assertions
    expect(userNavEl).not.toBeNull('not null when isAuthenticated is true');
  });

  it('#isAuthenticated === false should hide non-auth menus', fakeAsync(() => {
    spyOn(auth, 'isAuthenticated').and.returnValue(of(false));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const userNavEl = element.querySelector('.user-nav');
    // assertions
    expect(userNavEl).toBeNull('null when isAuthenticated is false');
  }));

  it('#isAuthorized === true should show profiles menu', () => {
    const profilesEl = element.querySelector('.profiles');
    // assertions
    expect(profilesEl).not.toBeNull('not null when isAuthorized is true');
  });

  it('#isAuthorized === false should hide profiles menus', fakeAsync(() => {
    spyOn(auth, 'isAuthorized').and.returnValue(of(false));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const profilesEl = element.querySelector('.profiles');
    // assertions
    expect(profilesEl).toBeNull('null when isAuthorized is false');
  }));

  it('#routerLinks shoud have the expected paths and textContent', () => {
    const pDetails = element.querySelector(`a[href='${uiPath.profiles.details}']`);
    const pCreate = element.querySelector(`a[href='${uiPath.profiles.create}']`);
    const pUpdate = element.querySelector(`a[href='${uiPath.profiles.update}']`);
    const aProfiles = element.querySelector(`a[href='${uiPath.admin.listProfiles}']`);
    const home = element.querySelector(`a[href='${uiPath.base}']`);
    // assertions
    expect(pDetails.textContent).toBe('Details');
    expect(pCreate.textContent).toBe('Create');
    expect(pUpdate.textContent).toBe('Update');
    expect(aProfiles.textContent).toBe('Profiles');
    expect(home.textContent).toBe('Home');
  });
});
