import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, convertToParamMap, ParamMap, Params } from '@angular/router';
import { DetailsByIdComponent } from './detailsById.component';
import { PageLoaderComponent } from '../../page-loader/page-loader.component';
import { ProfilesService } from '../../profiles/profiles.service';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { mockProfile } from '../../mock-data';
import { Profile } from '../../profiles/model-data';
import { TestScheduler } from 'rxjs/testing';
import { ErrorService } from 'src/app/error.service';
import { uiPath } from 'src/app/constants';


describe('DetailsByIdComponent', () => {
    let component: DetailsByIdComponent;
    let fixture: ComponentFixture<DetailsByIdComponent>;
    let scheduler: TestScheduler;
    let componentElement: HTMLElement;
    let mockService: Partial<ProfilesService>;
    let service: ProfilesService;
    let mockError: Partial<ErrorService>;
    let error: ErrorService;
    let mockRoute: Partial<ActivatedRoute>;
    let route: ActivatedRoute;
    let routeParam: Params;

    beforeEach(async(() => {
        routeParam = { id: mockProfile.userProfileId };
        mockService = {
            getProfileById(id: number): Observable<Profile> { return of(mockProfile) },
        };
        mockError = {
            handleRedirectRequestError: jasmine.createSpy('handleRedirectRequestError').and
            .returnValue(() => of(null))
        };
        mockRoute = { paramMap: of(convertToParamMap(routeParam)) };
        TestBed.configureTestingModule({
            declarations: [
                DetailsByIdComponent,
                PageLoaderComponent
            ],
            imports: [
                RouterModule.forRoot([]),
            ],
            providers: [
                { provide: ProfilesService, useValue: mockService },
                { provide: ErrorService, useValue: mockError },
                { provide: ActivatedRoute, useValue: mockRoute },
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailsByIdComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ProfilesService);
        error = fixture.debugElement.injector.get(ErrorService);
        route = fixture.debugElement.injector.get(ActivatedRoute);
        componentElement = fixture.debugElement.nativeElement;
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy('component to render');
    });

    it('#profile$ should emit the expected data', () => {
        scheduler.run(({ expectObservable }) => {
            const routeObservable: Observable<Profile> = route.paramMap.pipe(
                switchMap((params: ParamMap) => service.getProfileById(+params.get('id')))
            );
            const expectedMarbles = '(a|)';
            const expectedValue = { a: null };
            routeObservable.subscribe(res => expectedValue.a = res);
            expectObservable(component.profile$).toBe(expectedMarbles, expectedValue)
        })
    })

    it('Observable error will imit null', () => {
        // change getProfileById to return and error observable
        // there is no need to call ngOnInit because this function only runs
        // when you subscribe to the profiles$ observable
        spyOn(service, 'getProfileById').and.returnValue(throwError('error'));
        expect(service.getProfileById).not.toHaveBeenCalled();
        // subscription to profile$ emits a null value
        component.profile$.subscribe(
            val => {
                expect(val).toBeNull();
                expect(service.getProfileById).toHaveBeenCalled();
            }
        );
    });

    it('Observable error should load page-loader', fakeAsync(() => {
        // create getProfileById that make observable profile$ return null
        spyOn(service, 'getProfileById').and.returnValue(throwError('error'));
        let detailsPage: any;
        let loaderPage: any;
        // running ngOnInit with a valid profile$ value loads the detailsPage
        // but not the loaderPage
        detailsPage = componentElement.querySelector('.profile-details');
        loaderPage = componentElement.querySelector('.loader-view');
        expect(detailsPage).not.toBeNull();
        expect(loaderPage).toBeNull();
        // running ngOnInit again with the new value of getProfileById will make profile$ emit null
        // this will make detailsPage be null and loaderPage not
        component.ngOnInit();
        tick();
        fixture.detectChanges();
        detailsPage = componentElement.querySelector('.profile-details');
        loaderPage = componentElement.querySelector('.loader-view');
        expect(detailsPage).toBeNull();
        expect(loaderPage).not.toBeNull();
    }));

    it('should have a routerLink profiles', () => {
        const editLink = componentElement.querySelector('#profiles-btn');
        const expectedRoute = uiPath.admin.listProfiles;
        expect(editLink.getAttribute('href')).toBe(expectedRoute, 'equal expected route');
    });
});
