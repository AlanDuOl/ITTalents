import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MaterialModule } from '../material.module';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialog: Partial<MatDialogRef<ConfirmDialogComponent>>;
  let dialog: MatDialogRef<ConfirmDialogComponent>;

  beforeEach(async(() => {
    mockDialog = { close: jasmine.createSpy('close') }
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      imports: [MaterialModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialog }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    dialog = TestBed.get(MatDialogRef);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#click() on cancel should call #onCancelClick', fakeAsync(() => {
    spyOn(component, 'onCancelClick').and.callThrough();
    const cancelBtn = element.querySelector('#cancel-btn');
    const clickEvent = new Event('click');
    cancelBtn.dispatchEvent(clickEvent);
    tick();
    expect(component.onCancelClick).toHaveBeenCalled();
  }));

  it('#onCancelClick should call dialog.close with false', () => {
    expect(dialog.close).not.toHaveBeenCalled();
    component.onCancelClick();
    expect(dialog.close).toHaveBeenCalledWith(false);
  });

  it('#okBtn has mat-dialog-close set to true', () => {
    const okBtn = element.querySelector('#ok-btn');
    expect(okBtn.getAttribute('ng-reflect-dialog-result')).toBe('true', 'okbtn dialog result set to true');
  });
});
