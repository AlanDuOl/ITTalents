import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileList } from '../../profiles/model-data';
import { ProfilesService } from '../../profiles/profiles.service';
import { Observable } from 'rxjs';
import { uiPath, redirectCode, errorType } from '../../constants';
import { ErrorService } from '../../error.service';
import { FrontEndError } from '../../modeldata';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-profile-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  profiles$: Observable<ProfileList[]>;
  dataLoaded: boolean = false;

  constructor(private service: ProfilesService, private router: Router, private error: ErrorService) { }

  ngOnInit() {
    this.fetchData();
  }

  private fetchData(): void {
    this.profiles$ = this.service.fetchProfileList().pipe(
      catchError(this.error.handleRedirectRequestError<ProfileList[]>())
    );
  }

  goToDetailsById(profile: ProfileList): void {
    const profileId: number = !!profile ? +profile.id : null;
    if (profileId) {
      this.router.navigate([uiPath.admin.profileDetails, profileId]);
    }
    else {
      this.error.handleFrontEndError(
        new FrontEndError(errorType.nullArgument, 'list-component goToDetailsById'));
      this.router.navigate([uiPath.error, redirectCode.notFound]);
    }
  }

}
