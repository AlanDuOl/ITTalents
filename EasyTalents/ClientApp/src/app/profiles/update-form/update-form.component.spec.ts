import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { UpdateFormComponent } from './update-form.component';
import { ValidationErrorComponent } from '../../validation-error/validation-error.component';
import { ProfilesService } from '../profiles.service';
import { ProfileSubmit, ProfileResult } from '../model-data';
import { maxPageNumber, formLabels } from '../constants';
import { mockProfileSubmit, mockProfileResult, mockControls, MockLoaderComponent
} from '../../mock-data';
import { RedirectService } from 'src/app/redirect.service';
import { redirectCode, uiPath } from 'src/app/constants';
import { By } from '@angular/platform-browser';

describe('UpdateFormComponent', () => {
    let component: UpdateFormComponent;
    let fixture: ComponentFixture<UpdateFormComponent>;
    let element: HTMLElement;
    let mockService: Partial<ProfilesService>;
    let service: ProfilesService;
    let mockRouter: Partial<Router>;
    let router: Router;
    let mockRedirect: Partial<RedirectService>;
    let redirect: RedirectService;

    beforeEach(async(() => {
      mockService = {
        getSubmitData(): ProfileSubmit { return mockProfileSubmit; },
        getUpdateData(): Observable<FormGroup> { return of(mockControls); },
        updateProfile(): Observable<ProfileResult> { return of(mockProfileResult); },
        userHasProfile(): boolean { return true; },
        submittedResult: null,
      };
      mockRouter = {
        navigate: jasmine.createSpy('navigate').and.callFake(() => {})
      };
      mockRedirect = { redirectOnRequestError: jasmine.createSpy('redirectOnRequestError')
        .and.callFake(() => {})
      };
      TestBed.configureTestingModule({
        declarations: [ 
          UpdateFormComponent,
          ValidationErrorComponent,
          MockLoaderComponent,
        ],
        imports: [
          ReactiveFormsModule,
          HttpClientModule,
          RouterModule.forRoot([])
        ],
        providers: [
          { provide: ProfilesService, useValue: mockService },
          { provide: Router, useValue: mockRouter },
          { provide: RedirectService, useValue: mockRedirect },
        ],
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(UpdateFormComponent);
      service = fixture.debugElement.injector.get(ProfilesService);
      router = fixture.debugElement.injector.get(Router);
      redirect = fixture.debugElement.injector.get(RedirectService);
      component = fixture.componentInstance;
      element = fixture.debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set default data', () => {
      const name = "Update Profile";
      expect(component.name).toBe(name);
      expect(component.pageNumber).toBe(0, 'at start');
      expect(component.finalPage).toBe(maxPageNumber, 'at start');
      expect(component.labels).toEqual(formLabels, 'at start');
    });

    it('#ngOnInit call with #getUpdateData error', () => {
      const mockError = { status: 1 };
      spyOn(service, 'userHasProfile').and.callThrough();
      // make getCreateData fail
      spyOn(service, 'getUpdateData').and.returnValue(throwError(mockError));
      // reset data values
      component.form = null;
      component.dataLoaded = false;
      // call #ngOnInit
      component.ngOnInit();
      // assert
      expect(component.form).toBeNull();
      expect(component.dataLoaded).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(service.userHasProfile).not.toHaveBeenCalled();
      expect(redirect.redirectOnRequestError).toHaveBeenCalledWith(mockError.status);
    });

    it('#ngOnInit call with #getUpdateData success and user hasProfile equal false', () => {
      // should not set #form
      // should set dataLoaded to true
      // should call router.navigate with hasProfile and not with dataNotLoaded
      const expectedRoute1 = [uiPath.error, redirectCode.dataNotLoaded];
      const expectedRoute2 = [uiPath.error, redirectCode.noProfile];
      spyOn(service, 'userHasProfile').and.returnValue(false);
      // reset data values
      component.form = null;
      component.dataLoaded = false;
      // call #ngOnInit
      component.ngOnInit();
      // assert
      expect(component.form).toBeNull();
      expect(component.dataLoaded).toBe(true);
      expect(router.navigate).not.toHaveBeenCalledWith(expectedRoute1);
      expect(router.navigate).toHaveBeenCalledWith(expectedRoute2);
      expect(service.userHasProfile).toHaveBeenCalled();
      expect(redirect.redirectOnRequestError).not.toHaveBeenCalled();
    });

    it('#ngOnInit call with #getUpdateData success and user hasProfile equal true', () => {
      spyOn(service, 'userHasProfile').and.callThrough();
      // reset data values
      component.form = null;
      component.dataLoaded = false;
      // call #ngOnInit
      component.ngOnInit();
      // assert
      expect(component.form).toEqual(mockControls);
      expect(component.dataLoaded).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(service.userHasProfile).toHaveBeenCalled();
      expect(redirect.redirectOnRequestError).not.toHaveBeenCalled();
    });

    it('#ngOnInit call with #getUpdateData return null', () => {
      const expectedRoute1 = [uiPath.error, redirectCode.dataNotLoaded];
      const expectedRoute2 = [uiPath.error, redirectCode.noProfile];
      spyOn(service, 'userHasProfile').and.callThrough();
      spyOn(service, 'getUpdateData').and.returnValue(of(null));
      // reset data values
      component.form = null;
      component.dataLoaded = false;
      // call #ngOnInit
      component.ngOnInit();
      // assert
      expect(component.form).toBeNull();
      expect(component.dataLoaded).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(expectedRoute1);
      expect(router.navigate).not.toHaveBeenCalledWith(expectedRoute2);
      expect(service.userHasProfile).toHaveBeenCalled();
      expect(redirect.redirectOnRequestError).not.toHaveBeenCalled();
    });

    it('#ngOnDestry should set #service.submittedResult to #submitResult', () => {
      component.submitResult = mockProfileResult;
      expect(service.submittedResult).toBeNull();
      component.ngOnDestroy();
      expect(service.submittedResult).toEqual(component.submitResult);
    });

    it('#pageName should return the page name corresponding to current #pageNumber', () => {
        // for page number equal 0
        let expectedResult = 'page0';
        let result = component.pageName();
        expect(result).toEqual(expectedResult);
        // for page number equal 1
        component.pageNumber = 1;
        expectedResult = 'page1';
        result = component.pageName();
        expect(result).toBe(expectedResult);
        // for page number equal 2
        component.pageNumber = 2;
        expectedResult = 'page2';
        result = component.pageName();
        expect(result).toBe(expectedResult);
    });

    it('#controlsPage should return the #FormGroup page corresponding to current #pageNumber',
        () => {
        // for page number equal 0
        let result: FormGroup = component.controlsPage();
        let expectedResult: FormGroup = mockControls.get('page0') as FormGroup;
        expect(!!result).toBe(true);
        expect(result).toEqual(expectedResult);
        // page number equal 1
        component.pageNumber = 1;
        result = component.controlsPage();
        expectedResult = mockControls.get('page1') as FormGroup;
        expect(!!result).toBe(true);
        expect(result).toEqual(expectedResult);
        // for page number equal 2
        component.pageNumber = 2;
        result = component.controlsPage();
        expectedResult = mockControls.get('page2') as FormGroup;
        expect(!!result).toBe(true);
        expect(result).toEqual(expectedResult);
    });

    it('#techGroup should return the technologies FormGroup', () => {
        let result = component.techGroup();
        let expectedResult = mockControls.get('page2').get('technologies') as FormGroup;
        expect(!!result).toBe(true);
        expect(result).toEqual(expectedResult);
    });

    it('#techControls should return an array with technology names', () => {
        const result = component.techControls();
        const expectedResult = 
        Object.keys((mockControls.get('page2').get('technologies') as FormGroup).controls);
        expect(!!result).toBe(true);
        expect(result).toEqual(expectedResult);
    });

    it('#validateInputs should have the expected bahaviour: case 1', () => {
        // assumptions:
        // #validateInputs call with true value
        // #pageNumber === maxPageNumber
        // #getSubmitData returns valid data
        // #updateProfile returns valid data

        // set to final page
        component.pageNumber = maxPageNumber;
        const isPageValid = true;
        const expectedPath = [uiPath.profiles.result];
        const controlsPage2 = component.controlsPage();
        const markSpy = spyOn(controlsPage2, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'updateProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should not change
        // #getSubmitData should be called with form controls
        // #redirectOnRequestError should not be called
        // #updateProfile should be called with submitData
        // #submitResult should be set to #updateProfile response
        // #setUserProfile should be called
        // #navigate should be called with path [uiPath.profiles.result]
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).toHaveBeenCalledWith(component.form);
        expect(redirect.redirectOnRequestError).not.toHaveBeenCalled();
        expect(service.updateProfile).toHaveBeenCalledWith(mockProfileSubmit);
        expect(component.submitResult).toEqual(mockProfileResult);
        expect(router.navigate).toHaveBeenCalledWith(expectedPath);
    });

    it('#validateInputs should have the expected bahaviour: case 2', () => {
        // assumptions:
        // #validateInputs call with true value
        // #pageNumber === maxPageNumber
        // #getSubmitData returns valid data
        // #updateProfile returns invalid data

        // set to final page
        component.pageNumber = maxPageNumber;
        const mockError = { status: 1 };
        const isPageValid = true;
        const controlsPage2 = component.controlsPage();
        const markSpy = spyOn(controlsPage2, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'updateProfile').and.returnValue(throwError(mockError));
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should not increase
        // #getSubmitData should be called with form controls
        // #updateProfile should be called with submitData
        // #redirectOnRequestError should be called with error.status and not with redirectCode.unexpected
        // #submitResult should not be set to #updateProfile response
        // #navigate should not be called
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).toHaveBeenCalledWith(component.form);
        expect(service.updateProfile).toHaveBeenCalledWith(mockProfileSubmit);
        expect(redirect.redirectOnRequestError).not.toHaveBeenCalledWith(redirectCode.unexpected);
        expect(redirect.redirectOnRequestError).toHaveBeenCalledWith(mockError.status);
        expect(component.submitResult).not.toEqual(mockProfileResult);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('#validateInputs should have the expected bahaviour: case 3', () => {
        // assumptions:
        // #validateInputs call with true value
        // #pageNumber === maxPageNumber
        // #getSubmitData returns invalid data
        // #updateProfile won't be called

        // set to final page
        component.pageNumber = maxPageNumber;
        const isPageValid = true;
        const controlsPage2 = component.controlsPage();
        const markSpy = spyOn(controlsPage2, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.returnValue(null);
        spyOn(service, 'updateProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should not increase
        // #getSubmitData should be called with form controls
        // #updateProfile should not be called
        // #redirectOnRequestError should be called with redirectCode.unexpected
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).toHaveBeenCalledWith(component.form);
        expect(service.updateProfile).not.toHaveBeenCalled();
        expect(redirect.redirectOnRequestError).toHaveBeenCalledWith(redirectCode.unexpected);
    });

    it('#validateInputs should have the expected bahaviour: case 4', () => {
        // assumptions:
        // #validateInputs call with true value
        // #pageNumber = 0
        // #getSubmitData won't be called
        // #updateProfile won't be called

        const isPageValid = true;
        const controlsPage0 = component.controlsPage();
        const markSpy = spyOn(controlsPage0, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'updateProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should increase if small than maxPageNumber
        // #getSubmitData should not be called
        // #updateProfile should not be called
        // case 1: should increase pageNumber
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(1);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).not.toHaveBeenCalled();
        expect(service.updateProfile).not.toHaveBeenCalled();
        // case 2: should increase pageNumber
        component.pageNumber = maxPageNumber - 1;
        const controlsPage1 = component.controlsPage();
        const markSpy2 = spyOn(controlsPage1, 'markAllAsTouched');
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy2).not.toHaveBeenCalled();
        expect(service.getSubmitData).not.toHaveBeenCalled();
        expect(service.updateProfile).not.toHaveBeenCalled();
    });

    it('#validateInputs should have the expected bahaviour: case 5', () => {
        // assumptions:
        // #validateInputs call with false value

        const isPageValid = false;
        const currentPageNumber = component.pageNumber;
        const controlsPage0 = component.controlsPage();
        const markSpy = spyOn(controlsPage0, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'updateProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should be called
        // #pageNumber should not change
        // #getSubmitData should not be called
        // #updateProfile should not be called
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(currentPageNumber);
        expect(markSpy).toHaveBeenCalled();
        expect(service.getSubmitData).not.toHaveBeenCalled();
        expect(service.updateProfile).not.toHaveBeenCalled();
    });

    it('#pageBack should decrement #pageNumber by 1', () => {
        expect(component.pageNumber).toBe(0, 'at start');
        // attempt to decrement by 1
        component.pageBack();
        expect(component.pageNumber).toBe(0, 'dont decrement if it is <== 0');
        // set pageNumber
        component.pageNumber = 2;
        component.pageBack();
        expect(component.pageNumber).toBe(1, 'decrement if it is > 0');
    });

    // template tests
    it('#click on Next btn should call validateInputs', () => {
        spyOn(component, 'validateInputs').and.callThrough();
        const btn = element.querySelector('.next');
        const clickEvt = new Event('click');
        btn.dispatchEvent(clickEvt);
        expect(component.validateInputs).toHaveBeenCalledWith(component.controlsPage().valid);
    });

    it('#submit should call validateInputs', () => {
        spyOn(component, 'validateInputs').and.callThrough();
        component.pageNumber = maxPageNumber;
        fixture.detectChanges();
        fixture.debugElement.query(By.css('#user-form')).triggerEventHandler('ngSubmit', null);
        expect(component.validateInputs).toHaveBeenCalledWith(component.controlsPage().valid);
    });

    it('should call #pageBack on Back btn #click', () => {
        spyOn(component, 'pageBack').and.callThrough();
        const clickEvt = new Event('click');
        component.pageNumber = maxPageNumber;
        fixture.detectChanges();
        const btn = element.querySelector('.back');
        btn.dispatchEvent(clickEvt);
        expect(component.pageBack).toHaveBeenCalled();
    });

    it('should not show back btn in page0 only', () => {
        // case 1: page0
        let btn = element.querySelector('.back');
        expect(btn).toBeNull();
        // case 2: page1
        component.pageNumber = 1;
        fixture.detectChanges();
        btn = element.querySelector('.back');
        expect(btn).not.toBeNull();
        // case 3: page2
        component.pageNumber = 2;
        fixture.detectChanges();
        btn = null;
        btn = element.querySelector('.back');
        expect(btn).not.toBeNull();
    });

    it('should load form-view or page-loader', () => {
        // case 1: form did load
        let formView = element.querySelector('.form-view');
        let loader = element.querySelector('.loader');
        expect(formView).not.toBeNull();
        expect(loader).toBeNull();
        // case 2: form dada did not load
        component.dataLoaded = false;
        fixture.detectChanges();
        formView = element.querySelector('.form-view');
        loader = element.querySelector('#loader');
        expect(formView).toBeNull();
        expect(loader).not.toBeNull();
    });
});
