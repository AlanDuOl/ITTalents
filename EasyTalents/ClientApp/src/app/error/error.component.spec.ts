import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { redirectCode, redirectMessage } from '../constants';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let mockRoute: Partial<ActivatedRoute>;
  let route: ActivatedRoute;
  let scheduler: TestScheduler;
  let param: { [key: string]: any } = {};

  beforeEach(async(() => {
    mockRoute = { 
      paramMap: of(convertToParamMap(param)),
    }
    TestBed.configureTestingModule({
      declarations: [ ErrorComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    route = TestBed.get(ActivatedRoute);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set message$', () => {
    component.message$ = null;
    expect(component.message$).toBeNull();
    component.ngOnInit();
    expect(component.message$).not.toBeNull('set a value');
  });

  it('#message$ should emit not found on invalid code', () => {
    // reset the paramMap value
    delete param.code;
    param = {};
    // recreate message$
    component.ngOnInit();
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: redirectMessage[redirectCode.notFound] };
      // if code is valid and exists a string assinged to it
      // that specific string should be returned
      expectObservable(component.message$).toBe(expectedMarbles, expectedValue)
    })
  });

  it('#message$ should emit a #redirectMessage on valid code', () => {
    param.code = redirectCode.forbid;
    // recreate message$
    component.ngOnInit();
    scheduler.run(({ expectObservable }) => {
      const expectedMarbles = '(a|)';
      const expectedValue = { a: redirectMessage[param.code] };
      // if code is valid and exists a string assinged to it
      // that specific string should be returned
      expectObservable(component.message$).toBe(expectedMarbles, expectedValue);
    })
  });
});
