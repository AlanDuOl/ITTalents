import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ErrorService } from '../error.service';
import { errorType, apiPath, profileSession } from '../constants';
import { TechnologyService } from '../technologies/technology.service';
import { WorkingHoursService } from '../working-hours/working-hours.service';
import { WorkingShiftsService } from '../working-shifts/working-shifts.service';
import { ProfessionalInformationService } from '../professional-information/professional-information.service';
import { Observable, concat } from 'rxjs';
import { catchError, map, tap, every } from 'rxjs/operators';
import { FrontEndError } from '../modeldata';
import { ProfileSubmit, ProfileResult, ProfileData, ProfileList, Profile } from './model-data';


@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  private fetchedData: ProfileData = {
    technologies: null,
    workingShifts: null,
    professionalInformation: null,
    workingHours: null,
    profile: null
  }
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  submittedResult: ProfileResult;

  constructor(private error: ErrorService, private tech: TechnologyService, private workingHours: WorkingHoursService,
    private workingShifts: WorkingShiftsService, private professionalInfo: ProfessionalInformationService,
    private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  createProfile(data: ProfileSubmit): Observable<ProfileResult> {
    return this.http.post<ProfileResult>(`${this.baseUrl}${apiPath.profile.create}`, data, this.httpOptions).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'profiles-service createProfile')))
    );
  }

  updateProfile(data: ProfileSubmit): Observable<ProfileResult> {
    return this.http.put<ProfileResult>(`${this.baseUrl}${apiPath.profile.update}`, data, this.httpOptions).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'profiles-service updateProfile')))
    );
  }

  deleteProfile(): Observable<ProfileResult> {
    return this.http.delete<ProfileResult>(`${this.baseUrl}${apiPath.profile.delete}`, this.httpOptions).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'profiles-service deleteProfile')))
    );
  }

  deleteProfileById(id: number): Observable<ProfileResult> {
    return this.http.delete<ProfileResult>(`${this.baseUrl}${apiPath.profile.delete}/${id}`, this.httpOptions).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'profiles-service deleteProfileById')))
    );
  }

  fetchProfileList(): Observable<ProfileList[]> {
    return this.http.get<ProfileList[]>(`${this.baseUrl}${apiPath.admin.list}`).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'profiles-service fetchProfileList')))
    );
  }

  getProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}${apiPath.admin.get}/${id}`).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'profiles-service getProfileById')))
    );
  }

  fetchProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}${apiPath.profile.get}`).pipe(
      catchError(
        this.error.logRethrowObservableRequestError(
          new FrontEndError(errorType.observable, 'profiles-service fetchProfile')))
    );
  }

  getHttpOptions(): { [key: string]: any} {
    return this.httpOptions;
  }
  
  getFetchedData(): ProfileData {
    return this.fetchedData;
  }

  userHasProfile(): boolean {
    const hasProfile = sessionStorage.getItem(profileSession.item);
    if (hasProfile === profileSession.value) {
      return true;
    }
    else {
      return false;
    }
  }

  setUserProfile(): void {
    this.fetchProfile().subscribe(
      res => {
        if (!!res) {
          sessionStorage.setItem(profileSession.item, profileSession.value);
        }
        else {
          sessionStorage.setItem(profileSession.item, '');
        }
      },
      () => {
        sessionStorage.setItem(profileSession.item, '');
      }
    );
  }

  getCreateData(): Observable<FormGroup> {
    return this.fetchDataWithoutProfile().pipe(
      // create an observable with form
      map(dataLoaded => this.handleFormControls(dataLoaded))
    );
  }

  getUpdateData(): Observable<FormGroup> {
    return this.fetchUpdate().pipe(
      // create an observable with form
      map(dataLoaded => this.handleFormControls(dataLoaded))
    );
  }

  private fetchDataWithoutProfile():
    Observable<boolean> {
    // set the fetched data to service properties on each tap operator
    return concat(
      this.tech.fetch().pipe(
        tap(technologies => {
          this.fetchedData.technologies = technologies;
        })
      ),
      this.workingShifts.fetch().pipe(
        tap(workingShifts => {
          this.fetchedData.workingShifts = workingShifts;
        })
      ),
      this.workingHours.fetch().pipe(
        tap(workingHours => {
          this.fetchedData.workingHours = workingHours;
        })
      ),
      this.professionalInfo.fetch().pipe(
        tap(professionalInfo => {
          this.fetchedData.professionalInformation = professionalInfo;
        })
      )
    ).pipe(every(val => val.length > 0));
  }

  private fetchUpdate():
    Observable<boolean>{
    return concat(
      this.fetchProfile().pipe(
        tap(profile => this.fetchedData.profile = profile),
        map(profile => !!profile)
      ),
      this.fetchDataWithoutProfile()
    ).pipe(every(val => val === true));
  }

  private handleFormControls(dataLoaded: boolean): FormGroup {
    if (dataLoaded) {
      return this.getFormControls();
    }
    else {
      return null;
    }
  }

  private getFormControls(): FormGroup {
    try {
      const formControls = new FormGroup({
        // if profile has been loaded, use its values
        page0: new FormGroup({
          name: new FormControl(this.fetchedData.profile ? this.fetchedData.profile.name : '',
            [Validators.required, Validators.maxLength(30)]),
          email: new FormControl(this.fetchedData.profile ? this.fetchedData.profile.email : '',
            [Validators.required, Validators.email, Validators.maxLength(50)]),
          phone: new FormControl(this.fetchedData.profile ? this.fetchedData.profile.phone : '',
            [Validators.required, Validators.maxLength(20)]),
          city: new FormControl(this.fetchedData.profile ? this.fetchedData.profile.location.city : '',
            [Validators.required, Validators.maxLength(30)]),
          state: new FormControl(this.fetchedData.profile ? this.fetchedData.profile.location.state : '',
            [Validators.required, Validators.maxLength(30)]),
        }),
        page1: new FormGroup({
          professionalInformation: this.getInfoControls(),
          hourlySalary: new FormControl(this.fetchedData.profile ? this.fetchedData.profile.hourlySalary : '',
            [Validators.required, Validators.pattern('^[0-9]+$')]),
          dailyWorkingHours: this.getWorkingHoursControls(),
          workingShifts: this.getWorkingShiftControls()
        }),
        page2: new FormGroup({
          // hard codded IDs in getInfoValues
          linkCrud: new FormControl(this.getInfoValue(4), [Validators.maxLength(50)]),
          otherTechnology: new FormControl(this.getInfoValue(5), [Validators.maxLength(50)]),
          technologies: this.getTechnologyControls()
        })
      });
      return formControls;
    }
    catch (err) {
      if (err instanceof FrontEndError) {
        this.error.handleFrontEndError(err);
      }
      else this.error.handleBuiltInError(err, 'profiles-service setFormControls');
      return null;
    }
  }

  getSubmitData(form: FormGroup): ProfileSubmit {
    try {
      const submitData: ProfileSubmit = {
        email: form.get('page0').get('email').value,
        name: form.get('page0').get('name').value,
        phone: form.get('page0').get('phone').value,
        hourlySalary: parseInt(form.get('page1').get('hourlySalary').value),
        location: {
          city: form.get('page0').get('city').value,
          state: form.get('page0').get('state').value
        },
        technologies: this.getTechnoligiesData(form),
        professionalInformation: this.getProfessionalInfoData(form),
        workingHoursIds: this.getWorkingHoursData(form),
        workingShiftIds: this.getWorkingShiftsData(form)
      }
      if (this.fetchedData.profile) {
        submitData.profileId = this.fetchedData.profile.userProfileId;
      }
      return submitData;
    }
    catch (err) {
      if (err instanceof FrontEndError) {
        this.error.handleFrontEndError(err);
      }
      else this.error.handleBuiltInError(err, 'profiles-service getSubmitData');
      return null;
    }
  }

  private getWorkingShiftsData(form: FormGroup): number[] {
    let workingShiftIds: number[] = [];
    try {
      // declare locals
      let name: string;
      this.fetchedData.workingShifts.forEach(input => {
        name = input.description.toLowerCase();
        // only add to result if the value is checked
        if (form.get('page1').get('workingShifts').get(name).value) {
          workingShiftIds.push(input.workingShiftId);
        }
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getWorkingShiftsData', err.message);
    }
    return workingShiftIds;
  }

  private getWorkingHoursData(form: FormGroup): number[] {
    let workingHoursIds: number[] = [];
    try {
      // declare locals
      let name: string;
      this.fetchedData.workingHours.forEach(input => {
        name = `daily${input.dailyWorkingHoursId}`;
        // only add to the array if the value is checked
        if (form.get('page1').get('dailyWorkingHours').get(name).value) {
          workingHoursIds.push(input.dailyWorkingHoursId);
        }
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getWorkingHoursData', err.message);
    }
    return workingHoursIds;
  }

  private getTechnoligiesData(form: FormGroup): { id: number, score: number }[] {
    let techResults: { id: number, score: number }[] = [];
    try {
      // declare locals
      let name: string;
      let value: number;
      this.fetchedData.technologies.forEach(input => {
        name = input.description.replace(/\s/g, '').replace('.', 'dot').toLowerCase();
        value = parseInt(form.get('page2').get('technologies').get(name).value, 10);
        // only add to the array if the value is valid
        if (value || value === 0) {
          const techResult = {
            id: input.technologyId,
            score: value
          }
          techResults.push(techResult);
        }
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getTechnoligiesData', err.message);
    }
    return techResults;
  }

  private getProfessionalInfoData(form: FormGroup): { id: number, value: string }[] {
    let infoResult: { id: number, value: string }[] = [];
    try {
      // declare locals
      let name: string;
      let value: string;
      let firstLetter: string;
      this.fetchedData.professionalInformation.forEach(input => {
        firstLetter = input.description.charAt(0).toLowerCase();
        name = `${firstLetter}${input.description.slice(1)}`
        if (input.professionalInformationId === 4 || input.professionalInformationId === 5) {
          value = form.get('page2').get(name).value;
        }
        else {
          value = form.get('page1').get('professionalInformation').get(name).value;
        }
        // only add to the array if the value is valid
        if (value) {
          infoResult.push({ id: input.professionalInformationId, value })
        }
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getProfessionalInfoData', err.message);
    }
    return infoResult;
  }

  private getTechnologyControls(): FormGroup {
    const fieldControls = {};
    let controlName: string;
    let controlValue: string;
    try {
      // iterate on technologies and create a form control for each of them
      this.fetchedData.technologies.forEach(tech => {
        // remove invalid characters from description
        controlName = tech.description.replace(/\s/g, '').replace('.', 'dot').toLowerCase();
        // if profile has been loaded, use its value
        controlValue = this.getTechnologyValue(tech.technologyId);
        // Add a required validator where needed
        if (tech.required) {
          fieldControls[controlName] = new FormControl(controlValue, [Validators.required]);
        }
        else {
          fieldControls[controlName] = new FormControl(controlValue);
        }
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getTechnologyControls', err.message);
    }
    // create a form group with all field controls and return it
    const controlsGroup = new FormGroup(fieldControls);
    return controlsGroup;
  }

  private getTechnologyValue(id: number): string {
    // get the value associated with the id
    if (this.fetchedData.profile) {
      const value = this.fetchedData.profile.userTechnologies.find(ut => ut.technologyId === id).score;
      // if value is valid
      if (value || value === 0) {
        return value.toString();
      }
      else {
        throw new FrontEndError(errorType.nullReference, 'profiles-service getTechnologyValue');
      }
    }
    return '';
  }

  private getInfoControls(): FormGroup {
    const fieldControls = {};
    let controlName = '';
    let controlValue = '';
    try {
      // iterate on info and create a form control for each of them
      this.fetchedData.professionalInformation.forEach(info => {
        // don't include the two fields that should be in page2
        if (info.professionalInformationId !== 4 && info.professionalInformationId !== 5) {
          controlName = info.description.toLowerCase();
          // if profile has been loaded, use its value
          controlValue = this.getInfoValue(info.professionalInformationId).toString();
          // Add a required validator where needed
          if (info.required) {
            fieldControls[controlName] = new FormControl(controlValue, [Validators.required, Validators.maxLength(50)]);
          }
          else {
            fieldControls[controlName] = new FormControl(controlValue, [Validators.maxLength(50)]);
          }
        }
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getInfoControls', err.message);
    }
    // create a form group with all field controls and return it
    const controlsGroup = new FormGroup(fieldControls);
    return controlsGroup;
  }

  private getInfoValue(id: number): string {
    // get the value associated with the id
    if (this.fetchedData.profile) {
      const info = this.fetchedData.profile.userProfessionalInformation.
        find(upi => upi.professionalInformationId === id);
      if (info) {
        return info.value;
      }
    }
    return '';
  }

  private getWorkingShiftControls(): FormGroup {
    const fieldControls = {};
    let controlName = '';
    let controlValue = false;
    try {
      // iterate on WorkingShift and create a form control for each of them
      this.fetchedData.workingShifts.forEach(shift => {
        controlName = shift.description.toLowerCase();
        // if profile has been loaded, use its value
        controlValue = this.getShiftValue(shift.workingShiftId);
        fieldControls[controlName] = new FormControl(controlValue);
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getWorkingShiftControls', err.message);
    }
    // create a form group with all field controls and return it
    const controlsGroup = new FormGroup(fieldControls);
    return controlsGroup;
  }

  private getShiftValue(id: number): boolean {
    // get the value associated with the id
    if (this.fetchedData.profile) {
      const value = this.fetchedData.profile.userWorkingShifts.find(uws => uws.workingShiftId === id) ? true : false;
      return value;
    }
    return false;
  }

  private getWorkingHoursControls(): FormGroup {
    const fieldControls = {};
    let controlName = '';
    let controlValue = false;
    try {
      // iterate on WorkingHours and create a form control for each of them
      this.fetchedData.workingHours.forEach(workingHours => {
        controlName = `daily${workingHours.dailyWorkingHoursId}`;
        // if profile has been loaded, use its value
        controlValue = this.fetchedData.profile ? this.getWorkingHoursValue(workingHours.dailyWorkingHoursId) : false;
        fieldControls[controlName] = new FormControl(controlValue);
      });
    }
    catch (err) {
      throw new FrontEndError(errorType.builtIn, 'profiles-service getWorkingHoursControls', err.message);
    }
    // create a form group with all field controls and return it
    const controlsGroup = new FormGroup(fieldControls);
    return controlsGroup;
  }

  private getWorkingHoursValue(id: number): boolean {
    // get the value associated with the id
    if (this.fetchedData.profile) {
      const value = this.fetchedData.profile.userDailyWorkingHours.find(uwh =>
        uwh.dailyWorkingHoursId === id) ? true : false;
      return value;
    }
    return false;
  }
}
