import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { Profile, ProfileResult } from '../model-data';
import { ProfilesService } from '../profiles.service';
import { profileSession, uiPath, redirectCode } from '../../constants';
import { catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/error.service';
import { RedirectService } from 'src/app/redirect.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  profile$: Observable<Profile>;
  profileUpdate: string = uiPath.profiles.update;
  submitResult: ProfileResult;

  constructor(private service: ProfilesService, private dialog: MatDialog, private router: Router,
    private error: ErrorService, private redirect: RedirectService) { }

  ngOnInit() {
    this.profile$ = this.service.fetchProfile().pipe(
      catchError(this.error.handleRedirectRequestError())
    );
  }

  ngOnDestroy(): void {
    this.service.submittedResult = this.submitResult;
  }

  handleDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.delete();
      }
    });
  }

  private delete(): void {
    this.service.deleteProfile().subscribe(
      res => {
        this.submitResult = res;
        sessionStorage.setItem(profileSession.item, '');
        this.router.navigate([uiPath.profiles.result]);
      },
      err => { this.redirect.redirectOnRequestError(+err.status) },
    );
  }
}
