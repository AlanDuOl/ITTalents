import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Profile } from '../../profiles/model-data';
import { ProfilesService } from '../../profiles/profiles.service';
import { uiPath } from '../../constants';
import { ErrorService } from 'src/app/error.service';

@Component({
  selector: 'app-detailsById',
  templateUrl: './detailsById.component.html',
  styleUrls: ['./detailsById.component.css']
})
export class DetailsByIdComponent implements OnInit {

  profile$: Observable<Profile> = null;
  profilesPath: string = uiPath.admin.listProfiles;

  constructor(private service: ProfilesService, private route: ActivatedRoute,
    private error: ErrorService) { }

  ngOnInit() {
    this.profile$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.service.getProfileById(+params.get('id'))),
      catchError(this.error.handleRedirectRequestError<Profile>())
    );
  }
}
