import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetailsComponent } from './details.component';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog.component';
import { ProfilesService } from '../profiles.service';
import { Observable, of, throwError } from 'rxjs';
import { mockProfile, mockSubmitResult, MockLoaderComponent } from '../../mock-data';
import { Profile, ProfileResult } from '../model-data';
import { TestScheduler } from 'rxjs/testing';
import { MatDialog } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { ErrorService } from 'src/app/error.service';
import { profileSession, uiPath, redirectCode } from 'src/app/constants';
import { RedirectService } from 'src/app/redirect.service';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let scheduler: TestScheduler;
  let componentElement: HTMLElement;
  let mockService: Partial<ProfilesService>;
  let service: ProfilesService;
  let mockRouter: Partial<Router>;
  let router: Router;
  let mockDialog: Partial<MatDialog>;
  let dialog: MatDialog;
  let mockError: Partial<ErrorService>;
  let error: ErrorService;
  let mockRedirect: Partial<RedirectService>;
  let redirect: RedirectService;

  beforeEach((() => {
      mockRedirect = { 
          redirectOnRequestError: jasmine.createSpy('redirectOnRequestError').and.callThrough()
      }
      mockError = {
          handleRedirectRequestError: jasmine.createSpy('handleRedirectRequestError')
          .and.returnValue(() => of(null))
      };
      mockService = {
          fetchProfile(): Observable<Profile> { return of(mockProfile) },
          deleteProfile(): Observable<ProfileResult> { return of(mockSubmitResult) },
          submittedResult: null
      };
      mockRouter = { navigate: jasmine.createSpy('navigate').and.callFake(() => {}) };
      mockDialog = { open: jasmine.createSpy('open').and.returnValues(
          { afterClosed: () => of(true) }, { afterClosed: () => of(false) }) };
      @NgModule({
          declarations: [
              ConfirmDialogComponent
          ],
          imports: [
              MaterialModule,
              BrowserAnimationsModule,
          ],
          entryComponents: [
              ConfirmDialogComponent
          ],
          providers: [
              { provide: ProfilesService, useValue: mockService },
              { provide: Router, useValue: mockRouter },
              { provide: MatDialog, useValue: mockDialog },
              { provide: ErrorService, useValue: mockError },
              { provide: RedirectService, useValue: mockRedirect }
          ]
      })
      class TestModule {}
      TestBed.configureTestingModule({
          declarations: [
              DetailsComponent,
              MockLoaderComponent
          ],
          imports: [
            TestModule,
            RouterModule.forRoot([
              { path: 'error/8', component: MockLoaderComponent },
              { path: 'profiles/result', component: MockLoaderComponent },
            ])
          ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      componentElement = fixture.debugElement.nativeElement;
      service = fixture.debugElement.injector.get(ProfilesService);
      router = fixture.debugElement.injector.get(Router);
      dialog = fixture.debugElement.injector.get(MatDialog);
      error = fixture.debugElement.injector.get(ErrorService);
      redirect = fixture.debugElement.injector.get(RedirectService);
      scheduler = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected);
      });
      fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.profileUpdate).toEqual(uiPath.profiles.update)
  });

  it('#ngOnInit should set #profile$', () => {
      component.profile$ = null;
      expect(component.profile$).toBeNull();
      component.ngOnInit();
      expect(component.profile$).not.toBeNull();
  });

  it('#profile$ should emit the expected data', () => {
      // assert value for #fetchProfile success response
      scheduler.run(({ expectObservable }) => {
          const expectedMarbles = '(a|)';
          const expectedValue = { a: mockProfile };
          expectObservable(component.profile$).toBe(expectedMarbles, expectedValue);
      });
      // make #fetchProfile emit error
      spyOn(service, 'fetchProfile').and.returnValue(throwError('error'));
      // re-assign profile$
      component.ngOnInit();
      // assert value for #fetchProfile error response
      scheduler.run(({ expectObservable }) => {
          const expectedMarbles = '(a|)';
          const expectedValue = { a: null };
          expectObservable(component.profile$).toBe(expectedMarbles, expectedValue);
      });
  });

  it('#service.fetchProfile return null should redirect', () => {
      // arrange
      spyOn(service, 'fetchProfile').and.returnValue(of(null));
      spyOn(router, 'navigate').and.callFake(() => {
          return new Promise<boolean>((resolve, reject) => { return resolve(true) });
      });
      const expectedRoute = [uiPath.error, redirectCode.noProfile];

      // act
      // recreate profiles$
      component.ngOnInit();
      // subscribe with the new value
      component.profile$.subscribe(
        res => {
          // assert
          expect(res).toBeNull();
          expect(router.navigate).toHaveBeenCalledWith(expectedRoute);
        },
        () => {
          expect(true).toBe(false);
        }
      );
  });

  it('#ngOnDestroy should set #service.submittedResult to #submitResult', () => {
      expect(service.submittedResult).not.toEqual(component.submitResult);
      component.ngOnDestroy();
      expect(service.submittedResult).toEqual(component.submitResult);
  });

  it('#handleDelete should call dialog.open with dialog component', () => {
      expect(dialog.open).not.toHaveBeenCalled();
      component.handleDelete();
      expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent);
  });

  it('should call #delete if #dialog returns true and not if it returns false', () => {
      // if #deleteProfile is successful (default behaviour)
      spyOn(router, 'navigate').and.callThrough();
      const expectedRoute = uiPath.profiles.result;
      const fakeValue = 'test value';
      component.submitResult = null;
      sessionStorage.setItem(profileSession.item, fakeValue);
      // first call to #handleDelete dialog.open will return true
      // submitResult should be equal to #deleteProfile emitted value
      // session storage should reset item value
      // router should navigate to result component
      fixture.ngZone.run(() => {
          component.handleDelete();
      });
      expect(component.submitResult).toEqual(mockSubmitResult);
      expect(sessionStorage.getItem(profileSession.item)).toBe('');
      expect(router.navigate).toHaveBeenCalledWith([expectedRoute]);
      expect(redirect.redirectOnRequestError).not.toHaveBeenCalled();
      // second call to #handleDelete mockDialog.open returns false
      // #delete should not be called
      spyOn(service, 'deleteProfile').and.callThrough();
      spyOn(sessionStorage, 'setItem').and.callThrough();
      component.handleDelete();
      expect(service.deleteProfile).not.toHaveBeenCalled();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(redirect.redirectOnRequestError).not.toHaveBeenCalled();
  });

  it('should fall to error callback if #dialog returns true and request fails', () => {
      // if #deleteProfile is not successfull
      // submitResult should not be equal to #deleteProfile emitted value
      // session storage should not reset item value
      // router should not navigate to result component
      // #redirectOnRequestError should have been called with err.status
      const mockError = { status: 1 }
      spyOn(router, 'navigate').and.callThrough();
      spyOn(service, 'deleteProfile').and.returnValue(throwError(mockError));
      const expectedRoute = uiPath.profiles.result;
      const fakeValue = 'test value';
      component.submitResult = null;
      sessionStorage.setItem(profileSession.item, fakeValue);
      component.handleDelete();
      expect(component.submitResult).not.toEqual(mockSubmitResult);
      expect(sessionStorage.getItem(profileSession.item)).not.toBe('');
      expect(router.navigate).not.toHaveBeenCalledWith([expectedRoute]);
      service.deleteProfile().subscribe(
          () => {
              // should not be called
              expect(true).toBe(false);
          },
          err => {
              expect(redirect.redirectOnRequestError).toHaveBeenCalledWith(err.status);
          }
      )
  });

  it('#delete should be called on button click', fakeAsync(() => {
      spyOn(component, 'handleDelete');
      const deleteBtn = componentElement.querySelector('#delete');
      const clickEvent = new Event('click');
      deleteBtn.dispatchEvent(clickEvent);
      tick();
      expect(component.handleDelete).toHaveBeenCalled();
  }));

  it('should have a routerLink to register', () => {
      const editLink = componentElement.querySelector('#edit');
      const expectedRoute = component.profileUpdate;
      expect(editLink.getAttribute('href')).toEqual(expectedRoute);
  });

  it('should load view on #fetchProfile success', fakeAsync(() => {
      // #fetchProfile success is the default behaviour
      const detailsEl = componentElement.querySelector('.profile-details');
      const loaderEl = componentElement.querySelector('#loader');
      expect(detailsEl).not.toBeNull();
      expect(loaderEl).toBeNull();
  }));

  it('should not load view on #fetchProfile fail', fakeAsync(() => {
      // change #profile$ to emit null
      component.profile$ = of(null);
      fixture.detectChanges();
      tick();
      const detailsEl = componentElement.querySelector('.profile-details');
      const loaderEl = componentElement.querySelector('#loader');
      expect(detailsEl).toBeNull();
      expect(loaderEl).not.toBeNull();
  }));
    
  it('should show expected data', async(() => {
      let profile: Profile;
      let el: Element;
      let els: NodeListOf<Element>;
      let values: string[];
      let scores: number[];
      let descriptions: string[];
      component.profile$.subscribe(res => profile = res);

      // single element tests
      el = componentElement.querySelector('#id > td');
      expect(el.textContent).toBe(profile.userProfileId.toString());
      el = componentElement.querySelector('#name > td');
      expect(el.textContent).toBe(profile.name);
      el = componentElement.querySelector('#email > td');
      expect(el.textContent).toBe(profile.email);
      el = componentElement.querySelector('#phone > td');
      expect(el.textContent).toBe(profile.phone);
      el = componentElement.querySelector('#state > td');
      expect(el.textContent.toLowerCase()).toBe(profile.location.state);
      el = componentElement.querySelector('#city > td');
      expect(el.textContent.toLowerCase()).toBe(profile.location.city);
      el = componentElement.querySelector('#salary > td');
      expect(el.textContent).toBe(profile.hourlySalary.toString());

      // ---- collections elements ----
      // professional info
      els = componentElement.querySelectorAll('.info');
      descriptions = [ ...new Set(profile.userProfessionalInformation.
          map(info => info.professionalInformation.description.toLocaleLowerCase())) ];
      values = [ ...new Set(profile.userProfessionalInformation.map(info => info.value)) ];
      expect(els.length).toBe(profile.userProfessionalInformation.length, 'should have same length');
      els.forEach(element => {
          expect(descriptions).toContain(element.firstChild.textContent.toLowerCase().trim());
          expect(values).toContain(element.lastChild.textContent.trim());
      });

      // working hours
      els = componentElement.querySelectorAll('.working-hour');
      descriptions = [ ...new Set(profile.userDailyWorkingHours
          .map(hour => hour.dailyWorkingHours.description.toLocaleLowerCase())) ];
      expect(els.length).toBe(profile.userDailyWorkingHours.length, 'should have same length');
      els.forEach(element => {
          expect(descriptions).toContain(element.textContent.toLowerCase().trim());
      });

      // working shifts
      els = componentElement.querySelectorAll('.working-shift');
      descriptions = [ ...new Set(profile.userWorkingShifts
          .map(shift => shift.workingShift.description.toLocaleLowerCase())) ];
      expect(els.length).toBe(profile.userWorkingShifts.length, 'should have same length');
      els.forEach(element => {
          expect(descriptions).toContain(element.textContent.toLowerCase().trim());
      });

      // technologies
      els = componentElement.querySelectorAll('.tech');
      descriptions = [ ...new Set(profile.userTechnologies.
          map(tech => tech.technology.description.toLocaleLowerCase())) ];
      scores = [ ...new Set(profile.userTechnologies.map(tech => tech.score)) ];
      expect(els.length).toBe(profile.userTechnologies.length, 'should have same length');
      els.forEach(element => {
          expect(descriptions).toContain(element.firstChild.textContent.toLowerCase().trim());
          expect(scores).toContain(parseInt(element.lastChild.textContent.trim()));
      });
  }));
});
