import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesRoutingModule } from './profiles-routing.module';
import { MaterialModule } from '../material.module';
import { PageLoaderModule } from '../page-loader/page-loader.module';
import { CreateFormComponent } from './create-form/create-form.component';
import { SubmitResultComponent } from '././submit-result/submit-result.component';
import { ValidationErrorComponent } from '../validation-error/validation-error.component';
import { DetailsComponent } from './details/details.component';
import { UpdateFormComponent } from './update-form/update-form.component';


@NgModule({
  declarations: [
    CreateFormComponent,
    SubmitResultComponent,
    ValidationErrorComponent,
    DetailsComponent,
    UpdateFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    PageLoaderModule,
    ProfilesRoutingModule
  ]
})
export class ProfilesModule { }
