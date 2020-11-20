import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MockNavMenuComponent } from '../app/mock-data';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach((() => {
      TestBed.configureTestingModule({
          declarations: [
            AppComponent,
            MockNavMenuComponent
          ],
          imports: [
            RouterModule.forRoot([]),
            HttpClientModule,
          ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });

});