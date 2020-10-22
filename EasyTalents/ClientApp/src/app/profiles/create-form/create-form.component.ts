import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { maxPageNumber, formLabels } from '../constants';
import { ProfilesService } from '../profiles.service';
import { ProfileSubmit, ProfileResult } from '../model-data';
import { Router } from '@angular/router';
import { redirectCode, uiPath } from '../../constants';
import { RedirectService } from 'src/app/redirect.service';

@Component({
  selector: 'profiles-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit, OnDestroy {

  name: string = "Create Profile";
  finalPage: number = maxPageNumber;
  pageNumber: number = 0;
  form: FormGroup = null;
  labels: { [key: string]: any } = formLabels;
  dataLoaded: boolean = false;
  submitResult: ProfileResult;

  constructor(private service: ProfilesService, private router: Router,
    private redirect: RedirectService) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.service.submittedResult = this.submitResult;
  }
  // getters
  pageName(): string { return `page${this.pageNumber}`; }
  controlsPage(): FormGroup { return this.form.get(this.pageName()) as FormGroup; }
  techGroup(): FormGroup { return this.form.get('page2').get('technologies') as FormGroup }
  techControls(): string[] { return Object.keys(this.techGroup().controls); }

  validateInputs(isPageValid: boolean): void {
    if (isPageValid) {
      // if it's the last page submit the form, otherwise increment page number
      if (this.pageNumber === this.finalPage) {
        this.handleFormSubmit();
      }
      else {
        this.pageNext();
      }
    }
    else {
      this.controlsPage().markAllAsTouched();
    }
  }

  private pageNext(): void {
    if (this.pageNumber < this.finalPage) {
      this.pageNumber++;
    }
  }

  pageBack(): void {
    if (this.pageNumber > 0) {
      this.pageNumber--;
    }
  }

  private handleFormSubmit(): void {
    const submitData: ProfileSubmit = this.service.getSubmitData(this.form);
    if (!!submitData) {
      this.submitForm(submitData);
    }
    else {
      this.redirect.redirectOnRequestError(redirectCode.unexpected);
    }
  }

  private submitForm(submitData: ProfileSubmit): void {
    this.service.createProfile(submitData).subscribe(
      res => {
        this.submitResult = res;
        this.service.setUserProfile();
        this.router.navigate([uiPath.profiles.result]);
      },
      err => { this.redirect.redirectOnRequestError(+err.status) },
    );
  }

  private fetchData(): void {
    this.service.getCreateData().subscribe(
      res => { this.handleFetchedResult(res); },
      err => { this.redirect.redirectOnRequestError(+err.status) },
      () => { this.dataLoaded = true; }
    );
  }

  private handleFetchedResult(response: FormGroup): void {
    if (!this.service.userHasProfile()) {
      if (!!response) {
        this.form = response;
      }
      else {
        this.router.navigate([uiPath.error, redirectCode.dataNotLoaded]);
      }
    }
    else {
      this.router.navigate([uiPath.error, redirectCode.hasProfile]);
    }
  }
}
