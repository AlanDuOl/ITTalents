import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { ProfilesModule } from './profiles/profiles.module'
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { ConfirmDialogComponent } from './dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ErrorComponent,
    HomeComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    ApiAuthorizationModule,
    AdminModule,
    ProfilesModule,
    AppRoutingModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
