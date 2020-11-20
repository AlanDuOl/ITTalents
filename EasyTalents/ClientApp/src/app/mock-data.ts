import { Component, NgModule } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileSubmit, ProfileResult, ProfileList, Profile } from "./profiles/model-data";
import { DailyWorkingHours, ProfessionalInformation, Technology, WorkingShift } from './modeldata';
import { ActivatedRouteSnapshot, convertToParamMap, UrlSegment } from '@angular/router';
import { of } from 'rxjs';

export const mockProfileSubmit: ProfileSubmit = {
    profileId: 1,
    email: 'abc@ab.com',
    name: 'abc',
    phone: '94454545',
    hourlySalary: 20,
    location: { city: 'hyrule', state: 'castelvania' },
    technologies: [{ id: 1, score: 3 }],
    professionalInformation: [{ id: 1, value: 'my info' }],
    workingHoursIds: [1, 3],
    workingShiftIds: [2, 4]
}

export const mockProfileResult: ProfileResult = {
  updated: false,
  created: false,
  deleted: false
}

export const mockInformation: ProfessionalInformation = {
  professionalInformationId: 1,
  description: 'skype',
  required: true
}

export const mockTechnology: Technology = {
  technologyId: 1,
  description: 'tech1',
  required: true
}

export const mockWorkingShift: WorkingShift = {
  workingShiftId: 1,
  description: 'morning',
}

export const mockWorkingHours: DailyWorkingHours = {
  dailyWorkingHoursId: 1,
  description: 'daily1',
}

export const mockControls: FormGroup = new FormGroup({
  page0: new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
  }),
  page1: new FormGroup({
    professionalInformation: new FormGroup({
      skype: new FormControl(''),
      linkedin: new FormControl(''),
      portfolio: new FormControl(''),
    }),
    hourlySalary: new FormControl(''),
    dailyWorkingHours: new FormGroup({
      daily1: new FormControl(),
      daily2: new FormControl(),
      daily3: new FormControl(),
      daily4: new FormControl(),
      daily5: new FormControl(),
    }),
    workingShifts: new FormGroup({
      morning: new FormControl(),
      afternoon: new FormControl(),
      dawn: new FormControl(),
      night: new FormControl(),
      business: new FormControl(),
    })
  }),
  page2: new FormGroup({
    linkCrud: new FormControl(''),
    otherTechnology: new FormControl(''),
    technologies: new FormGroup({
      tech1: new FormControl('')
    })
  }),
});

export const mockProfileList: ProfileList = {
  id: 1,
  name: 'boris',
  email: 'abc@gmail.com',
  phone: '82838283831',
};

export const mockProfile: Profile = {
  userProfileId: 1,
  name: 'mockProfile',
  email: 'mockProfile@abc.com',
  phone: '123456789',
  hourlySalary: 12,
  locationId: 1,
  createdAt: new Date(2020, 7, 14),
  updatedAt: new Date(2020, 7, 14),
  location: {
    locationId: 1,
    city: 'city', state: 'state'
  },
  userTechnologies: [
    {
      score: 1,
      technologyId: 1,
      userProfileId: 1,
      technology: {
        technologyId: 1,
        description: 'tech1',
        required: true
      }
    }
  ],
  userProfessionalInformation: [
    {
      professionalInformationId: 1,
      userProfileId: 1,
      value: 'abc',
      professionalInformation: {
        professionalInformationId: 1,
        description: 'professionalInformation',
        required: false
      }
    }
  ],
  userDailyWorkingHours: [
    {
      dailyWorkingHoursId: 1,
      userProfileId: 1,
      dailyWorkingHours: {
        dailyWorkingHoursId: 1,
        description: 'workingHours'
      }
    }
  ],
  userWorkingShifts: [
    {
      userProfileId: 1,
      workingShiftId: 1,
      workingShift: {
        workingShiftId: 1,
        description: 'workingshift'
      }
    }
  ]
}

@Component({
  selector: 'app-login-menu',
  template: '<p>App Login Menu</p>',
  styles: ['']
})
export class AppLoginMenuComponent {}

@Component({
  selector: 'app-page-loader',
  template: '<p id="loader">App Loader</p>',
  styles: ['']
})
export class MockLoaderComponent {}

@Component({
  selector: 'app-root',
  template: '<p id="root">App Root</p>',
  styles: ['']
})
export class MockAppRootComponent {}

@NgModule({
  declarations: [MockAppRootComponent]
})
export class MockModule {}

export const mockRequestError = { status: 1, message: 'error' };

export const mockBaseUrl = 'http://www.abc.com';

export const mockSubmitResult: ProfileResult = {
  created: false,
  updated: false,
  deleted: false
};

export const mockRouteSnapshotLogin: ActivatedRouteSnapshot = {
  url: [
    new UrlSegment('login', { name: 'login' }),
    new UrlSegment('login', { name: 'login' })
  ],
  paramMap: convertToParamMap(of({})),
  queryParamMap: convertToParamMap(of({})),
  params: {},
  data: {},
  queryParams: {},
  routeConfig: {},
  component: '',
  fragment: '',
  outlet: '',
  parent: null,
  root: null,
  firstChild: null,
  children: null,
  pathFromRoot: null
}

export const mockRouteSnapshotLogout: ActivatedRouteSnapshot = {
  url: [
    new UrlSegment('logout', { name: 'logout' }),
    new UrlSegment('logout', { name: 'logout' })
  ],
  paramMap: convertToParamMap(of({})),
  queryParamMap: convertToParamMap(of({})),
  params: {},
  data: {},
  queryParams: {},
  routeConfig: {},
  component: '',
  fragment: '',
  outlet: '',
  parent: null,
  root: null,
  firstChild: null,
  children: null,
  pathFromRoot: null
}
