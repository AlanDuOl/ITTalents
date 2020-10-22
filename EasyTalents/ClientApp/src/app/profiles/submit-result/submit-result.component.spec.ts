import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mockSubmitResult } from '../../mock-data';
import { ProfilesService } from '../profiles.service';
import { SubmitResultComponent } from './submit-result.component';

describe('SubmitResultComponent', () => {
  let component: SubmitResultComponent;
  let fixture: ComponentFixture<SubmitResultComponent>;
  let element: HTMLElement;
  let mockService: Partial<ProfilesService>;
  let service: ProfilesService;

  beforeEach(async(() => {
    mockService = { submittedResult: mockSubmitResult }
    TestBed.configureTestingModule({
      declarations: [ SubmitResultComponent ],
      providers: [
        { provide: ProfilesService, useValue: mockService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitResultComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    service = TestBed.get(ProfilesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set #submitResult to #service.submittedResult', () => {
    component.submitResult = null;
    expect(component.submitResult).not.toEqual(service.submittedResult);
    component.ngOnInit();
    expect(component.submitResult).toEqual(service.submittedResult);
  });
  
  it('#submitResult default value should not load any message but load the view', () => {
    const viewEl = element.querySelector('.submit-view');
    const createdEl = element.querySelector('.created');
    const updatedEl = element.querySelector('.updated');
    const deletedEl = element.querySelector('.deleted');
    expect(viewEl).not.toBeNull();
    expect(createdEl).toBeNull();
    expect(updatedEl).toBeNull();
    expect(deletedEl).toBeNull();
  });

  it('#submitResult equal null should not load the view', () => {
    component.submitResult = null;
    fixture.detectChanges();
    const viewEl = element.querySelector('.submit-view');
    expect(viewEl).toBeNull();
  });

  it('#submitResult.created only equal true should load only created message', () => {
    component.submitResult.created = true;
    fixture.detectChanges();
    const expectedContent = 'Created successfully';
    const createdEl = element.querySelector('.created');
    const updatedEl = element.querySelector('.updated');
    const deletedEl = element.querySelector('.deleted');
    expect(createdEl).not.toBeNull();
    expect(createdEl.textContent).toContain(expectedContent);
    expect(updatedEl).toBeNull();
    expect(deletedEl).toBeNull();
  });

  it('#submitResult.updated only equal true should load only updated message', () => {
    component.submitResult.updated = true;
    fixture.detectChanges();
    const expectedContent = 'Updated successfully';
    const createdEl = element.querySelector('.created');
    const updatedEl = element.querySelector('.updated');
    const deletedEl = element.querySelector('.deleted');
    expect(createdEl).toBeNull();
    expect(updatedEl).not.toBeNull();
    expect(updatedEl.textContent).toContain(expectedContent);
    expect(deletedEl).toBeNull();
  });

  it('#submitResult.deleted only equal true should load only deleted message', () => {
    component.submitResult.deleted = true;
    fixture.detectChanges();
    const expectedContent = 'Deleted successfully';
    const createdEl = element.querySelector('.created');
    const updatedEl = element.querySelector('.updated');
    const deletedEl = element.querySelector('.deleted');
    expect(createdEl).toBeNull();
    expect(updatedEl).toBeNull();
    expect(deletedEl).not.toBeNull();
    expect(deletedEl.textContent).toContain(expectedContent);
  });
});
