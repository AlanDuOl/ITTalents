import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { CreateFormComponent } from './create-form.component';
import { ValidationErrorComponent } from '../../validation-error/validation-error.component';
import { ProfilesService } from '../profiles.service';
import { ProfileSubmit, ProfileResult } from '../model-data';
import { maxPageNumber, formLabels } from '../constants';
import { mockProfileSubmit, mockProfileResult, mockControls, MockLoaderComponent
} from '../../mock-data';
import { RedirectService } from 'src/app/redirect.service';
import { redirectCode, uiPath } from 'src/app/constants';
import { By } from '@angular/platform-browser';

describe('CreateFormComponent', () => {
    let component: CreateFormComponent;
    let fixture: ComponentFixture<CreateFormComponent>;
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
            getCreateData(): Observable<FormGroup> { return of(mockControls); },
            createProfile(): Observable<ProfileResult> { return of(mockProfileResult); },
            userHasProfile(): boolean { return false; },
            setUserProfile: jasmine.createSpy('setUserProfile').and.callFake(() => {}),
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
                CreateFormComponent,
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
        fixture = TestBed.createComponent(CreateFormComponent);
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
        const name = "Create Profile";
        expect(component.name).toBe(name);
        expect(component.pageNumber).toBe(0, 'at start');
        expect(component.finalPage).toBe(maxPageNumber, 'at start');
        expect(component.labels).toEqual(formLabels, 'at start');
    });

    it('#ngOnInit call with #getCreateData error', () => {
        const mockError = { status: 1 };
        spyOn(service, 'userHasProfile').and.callThrough();
        // make getCreateData fail
        spyOn(service, 'getCreateData').and.returnValue(throwError(mockError));
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

    it('#ngOnInit call with #getCreateData success and user hasProfile equal true', () => {
        // should not set #form
        // should set dataLoaded to true
        // should call router.navigate with hasProfile and not with dataNotLoaded
        const expectedRoute1 = [uiPath.error, redirectCode.dataNotLoaded];
        const expectedRoute2 = [uiPath.error, redirectCode.hasProfile];
        spyOn(service, 'userHasProfile').and.returnValue(true);
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

    it('#ngOnInit call with #getCreateData success and user hasProfile equal false', () => {
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

    it('#ngOnInit call with #getCreateData return null', () => {
        const expectedRoute1 = [uiPath.error, redirectCode.dataNotLoaded];
        const expectedRoute2 = [uiPath.error, redirectCode.hasProfile];
        spyOn(service, 'userHasProfile').and.callThrough();
        spyOn(service, 'getCreateData').and.returnValue(of(null));
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
        // #createProfile returns valid data

        // set to final page
        component.pageNumber = maxPageNumber;
        const isPageValid = true;
        const expectedPath = [uiPath.profiles.result];
        const controlsPage2 = component.controlsPage();
        const markSpy = spyOn(controlsPage2, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'createProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should not change
        // #getSubmitData should be called with form controls
        // #redirectOnRequestError should not be called
        // #createProfile should be called with submitData
        // #submitResult should be set to #createProfile response
        // #setUserProfile should be called
        // #navigate should be called with path [uiPath.profiles.result]
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).toHaveBeenCalledWith(component.form);
        expect(redirect.redirectOnRequestError).not.toHaveBeenCalled();
        expect(service.createProfile).toHaveBeenCalledWith(mockProfileSubmit);
        expect(component.submitResult).toEqual(mockProfileResult);
        expect(service.setUserProfile).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(expectedPath);
    });

    it('#validateInputs should have the expected bahaviour: case 2', () => {
        // assumptions:
        // #validateInputs call with true value
        // #pageNumber === maxPageNumber
        // #getSubmitData returns valid data
        // #createProfile returns invalid data

        // set to final page
        component.pageNumber = maxPageNumber;
        const mockError = { status: 1 };
        const isPageValid = true;
        const controlsPage2 = component.controlsPage();
        const markSpy = spyOn(controlsPage2, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'createProfile').and.returnValue(throwError(mockError));
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should not change
        // #getSubmitData should be called with form controls
        // #createProfile should be called with submitData
        // #redirectOnRequestError should be called with error.status and not with redirectCode.unexpected
        // #submitResult should not be set to #createProfile response
        // #setUserProfile should not be called
        // #navigate should not be called
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).toHaveBeenCalledWith(component.form);
        expect(service.createProfile).toHaveBeenCalledWith(mockProfileSubmit);
        expect(redirect.redirectOnRequestError).not.toHaveBeenCalledWith(redirectCode.unexpected);
        expect(redirect.redirectOnRequestError).toHaveBeenCalledWith(mockError.status);
        expect(component.submitResult).not.toEqual(mockProfileResult);
        expect(service.setUserProfile).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('#validateInputs should have the expected bahaviour: case 3', () => {
        // assumptions:
        // #validateInputs call with true value
        // #pageNumber === maxPageNumber
        // #getSubmitData returns invalid data
        // #createProfile won't be called

        // set to final page
        component.pageNumber = maxPageNumber;
        const isPageValid = true;
        const controlsPage2 = component.controlsPage();
        const markSpy = spyOn(controlsPage2, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.returnValue(null);
        spyOn(service, 'createProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should not change
        // #getSubmitData should be called with form controls
        // #createProfile should not be called
        // #redirectOnRequestError should be called with redirectCode.unexpected
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).toHaveBeenCalledWith(component.form);
        expect(service.createProfile).not.toHaveBeenCalled();
        expect(redirect.redirectOnRequestError).toHaveBeenCalledWith(redirectCode.unexpected);
    });

    it('#validateInputs should have the expected bahaviour: case 4', () => {
        // assumptions:
        // #validateInputs call with true value
        // #pageNumber = 0
        // #getSubmitData won't be called
        // #createProfile won't be called

        const isPageValid = true;
        const controlsPage0 = component.controlsPage();
        const markSpy = spyOn(controlsPage0, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'createProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should not be called
        // #pageNumber should increase if small than maxPageNumber
        // #getSubmitData should not be called
        // #createProfile should not be called
        // case 1: should increase pageNumber
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(1);
        expect(markSpy).not.toHaveBeenCalled();
        expect(service.getSubmitData).not.toHaveBeenCalled();
        expect(service.createProfile).not.toHaveBeenCalled();
        // case 2: should increase pageNumber
        component.pageNumber = maxPageNumber - 1;
        const controlsPage1 = component.controlsPage();
        const markSpy2 = spyOn(controlsPage1, 'markAllAsTouched');
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(maxPageNumber);
        expect(markSpy2).not.toHaveBeenCalled();
        expect(service.getSubmitData).not.toHaveBeenCalled();
        expect(service.createProfile).not.toHaveBeenCalled();
    });

    it('#validateInputs should have the expected bahaviour: case 5', () => {
        // assumptions:
        // #validateInputs call with false value

        const isPageValid = false;
        const currentPageNumber = component.pageNumber;
        const controlsPage0 = component.controlsPage();
        const markSpy = spyOn(controlsPage0, 'markAllAsTouched');
        spyOn(service, 'getSubmitData').and.callThrough();
        spyOn(service, 'createProfile').and.callThrough();
        
        // what should happen:
        // #controlsPage().markAllAsTouched should be called
        // #pageNumber should not change
        // #getSubmitData should not be called
        // #createProfile should not be called
        component.validateInputs(isPageValid);
        expect(component.pageNumber).toBe(currentPageNumber);
        expect(markSpy).toHaveBeenCalled();
        expect(service.getSubmitData).not.toHaveBeenCalled();
        expect(service.createProfile).not.toHaveBeenCalled();
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
    })

    // TODO: test button click on template
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

    it('#template should show the expected content: header', () => {
        const mainHeading = element.querySelector('.form-view > .heading');
        let heading = element.querySelector('#form-header > .heading');
        let els = element.querySelectorAll('.instruction');
        // for page0
        expect(heading.textContent).toBe(formLabels.header[component.pageNumber]);
        expect(mainHeading.textContent).toBe(component.name);
        expect(els.length).toBe(formLabels.instruction[component.pageNumber].length);
        els.forEach(el => {
            expect(formLabels.instruction[component.pageNumber]).toContain(el.textContent);
        });
        // for page1
        component.pageNumber = 1;
        fixture.detectChanges();
        heading = element.querySelector('#form-header > .heading');
        els = element.querySelectorAll('.instruction');
        expect(heading.textContent).toBe(formLabels.header[component.pageNumber]);
        expect(els.length).toBe(formLabels.instruction[component.pageNumber].length);
        els.forEach(el => {
            expect(formLabels.instruction[component.pageNumber]).toContain(el.textContent);
        });
        // for page2
        component.pageNumber = 2;
        fixture.detectChanges();
        heading = element.querySelector('#form-header > .heading');
        els = element.querySelectorAll('.instruction');
        expect(heading.textContent).toBe(formLabels.header[component.pageNumber]);
        expect(els.length).toBe(formLabels.instruction[component.pageNumber].length);
        els.forEach(el => {
            expect(formLabels.instruction[component.pageNumber]).toContain(el.textContent);
        });
    });

    it('#template should show the expected content: page0', () => {
        const remove = element.querySelector('.page0 .required');
        const placeHolder = element.querySelector('.page0 input').getAttribute('placeholder');
        let validError = element.querySelectorAll('.page0 .error-message');
        let els = element.querySelectorAll('.page0 .question');
        let names = [ ...new Set(formLabels.page[component.pageNumber]
            .map((el: { [key: string]: string}) => el.name)) ];
        let labels = [ ...new Set(formLabels.page[component.pageNumber]
            .map((el: { [key: string]: string}) => el.label)) ];
        expect(els.length).toBe(names.length);
        expect(els.length).toBe(labels.length);
        els.forEach(el => {
            expect(labels).toContain(el.firstChild.textContent.replace(remove.textContent, ''));
            expect(names).toContain((el.lastChild as Element).getAttribute('ng-reflect-name'));
            expect(placeHolder).toBe(formLabels.placeholder);
        });
        expect(validError.length).toBe(0, 'there should be no errors');
        // make required field valid
        component.form.get('page0').get('name').setErrors({ required: true });
        component.form.get('page0').get('name').markAsTouched();
        fixture.detectChanges();
        validError = element.querySelectorAll('.page0 .error-message');
        expect(component.form.get('page0').valid).toBe(false);
        expect(validError.length).toBeGreaterThan(0, 'there should be errors');
    });

    it('#template should show the expected content: page1 text', () => {
        component.pageNumber = 1;
        fixture.detectChanges();
        let textToRemove: string;
        let validError: NodeListOf<Element>;
        let els: NodeListOf<Element>;
        const names = [ ...new Set(formLabels.page[component.pageNumber]
            .map((el: { [key: string]: string}) => el.name)) ];
        names.push(formLabels.hourlySalary.name);
        const labels = [ ...new Set(formLabels.page[component.pageNumber]
            .map((el: { [key: string]: string}) => el.label)) ];
        labels.push(formLabels.hourlySalary.label);

        els = element.querySelectorAll('.page1 > .text-element .question');
        expect(els.length).toBe(names.length);
        expect(els.length).toBe(labels.length);
        els.forEach(el => {
            textToRemove = !!el.querySelector('.required') ? el.querySelector('.required').textContent : '';
            expect(labels).toContain(el.firstChild.textContent.replace(textToRemove, ''));
            expect(names).toContain((el.lastChild as Element).getAttribute('ng-reflect-name'));
            expect((el.lastChild as Element).getAttribute('placeholder')).toBe(formLabels.placeholder);
            if ((el.lastChild as Element).getAttribute('ng-reflect-name') === 'skype' ||
            (el.lastChild as Element).getAttribute('ng-reflect-name') === 'hourlySalary') {
                expect(textToRemove).not.toBe('');
            }
            else {
                expect(textToRemove).toBe('');
            }
        });
        validError = element.querySelectorAll('.page1 .error-message');
        expect(validError.length).toBe(0, 'there should be no errors');
        // make required field valid
        component.form.get('page1').get('hourlySalary').setErrors({ required: true });
        component.form.get('page1').get('hourlySalary').markAsTouched();
        fixture.detectChanges();
        validError = element.querySelectorAll('.page1 .error-message');
        expect(validError.length).toBeGreaterThan(0, 'there should be errors');
    });

    it('#template should show the expected content: page1 checkbox', () => {
        component.pageNumber = 1;
        fixture.detectChanges();
        let headerEls: NodeListOf<Element>;
        let optionEls: NodeListOf<Element>;

        const headers = [ ...new Set(formLabels.checkbox
            .map((el: { [key: string]: string}) => el.header)) ];
        const names = [ ...new Set(formLabels.checkbox
            .flatMap((el: { [key: string]: any}) => el.options.map((op: any) => op.name))) ];
        const labels = [ ...new Set(formLabels.checkbox
            .flatMap((el: { [key: string]: any}) => el.options.map((op: any) => op.label))) ];
        const values = [ ...new Set(formLabels.checkbox
            .flatMap((el: { [key: string]: any}) => el.options.map((op: any) => op.value))) ];

        headerEls = element.querySelectorAll('.page1 > .checkbox-element .question');
        expect(headerEls.length).toBe(headerEls.length);
        headerEls.forEach(el => {
            expect(headers).toContain(el.textContent.trim());
        });

        optionEls = element.querySelectorAll('.page1 > .checkbox-element .option');
        expect(optionEls.length).toBe(names.length);
        expect(optionEls.length).toBe(labels.length);
        expect(optionEls.length).toBe(values.length);

        optionEls.forEach(el => {
            expect(names).toContain((el.firstChild as Element).getAttribute('ng-reflect-name'));
            expect(values).toContain((el.firstChild as Element).getAttribute('value'));
            expect(labels).toContain(el.textContent.trim());
        });
    });

    it('#template should show the expected content: page 2 text', () => {
        component.pageNumber = 2;
        fixture.detectChanges();
        let els: NodeListOf<Element>;
        const names = [ ...new Set(formLabels.page[component.pageNumber]
            .map((el: { [key: string]: string}) => el.name)) ];
        const labels = [ ...new Set(formLabels.page[component.pageNumber]
            .map((el: { [key: string]: string}) => el.label)) ];

        els = element.querySelectorAll('.page2 > .text-element .question');
        expect(els.length).toBe(names.length);
        expect(els.length).toBe(labels.length);
        els.forEach(el => {
            expect(labels).toContain(el.firstChild.textContent.trim());
            expect(names).toContain((el.lastChild as Element).getAttribute('ng-reflect-name'));
            expect((el.lastChild as Element).getAttribute('placeholder')).toBe(formLabels.placeholder);
        });
    });

    it('#template should show the expected content: page 2 radio', () => {
        component.pageNumber = 2;
        fixture.detectChanges();
        let els: NodeListOf<Element>;
        let label1: ChildNode;
        let label2: ChildNode;
        let options: NodeListOf<Element>;
        let error: Element;
        let textToRemove: string;
        let elName: string;
        const names = [ ...new Set(Object.keys((mockControls.get('page2')
            .get('technologies') as FormGroup).controls)) ];
        // tests
        els = element.querySelectorAll('.page2 > .radio-element');
        expect(els.length).toBe(names.length);
        els.forEach(el => {
            label1 = el.querySelector('.radio-container').firstChild.firstChild;
            label2 = el.querySelector('.radio-container').lastChild.firstChild;
            error = el.querySelector('.error-message');
            options = el.querySelectorAll('.option');
            textToRemove = !!element.querySelector('.radio-element .required') ? 
            element.querySelector('.radio-element .required').textContent : '';
            elName = el.firstChild.textContent.toLowerCase().trim().replace(textToRemove, '');
            expect(names).toContain(elName);
            expect(label1.textContent.trim()).toBe(formLabels.technologies.startLabel);
            expect(label2.textContent.trim()).toBe(formLabels.technologies.endLabel);
            expect(options.length).toBe(formLabels.technologies.options.length);
            expect(error).toBeNull();
            options.forEach(op => {
                expect(formLabels.technologies.options).toContain(op.firstChild.textContent.trim());
            });
            // add errors for next test
            component.form.get('page2').get('technologies').get(elName).setErrors({ required: true });
        });
        // mark controls
        component.form.get('page2').get('technologies').markAllAsTouched();
        fixture.detectChanges();
        els.forEach(el => {
            error = el.querySelector('.error-message');
            expect(error).not.toBeNull();
        });
    });
});
