import { Technology, ProfessionalInformation, DailyWorkingHours, WorkingShift } from '../modeldata';

export interface ProfileData {
  technologies: Technology[],
  workingShifts: WorkingShift[],
  professionalInformation: ProfessionalInformation[],
  workingHours: DailyWorkingHours[],
  profile: Profile
}

export interface Profile {
  userProfileId: number,
  name: string,
  email: string,
  phone: string,
  hourlySalary: number,
  locationId: number,
  createdAt: Date,
  updatedAt: Date,
  location: Location,
  userTechnologies: UserTechnologies[],
  userProfessionalInformation: UserProfessionalInformation[],
  userDailyWorkingHours: UserDailyWorkingHours[],
  userWorkingShifts: UserWorkingShifts[]
}

export interface ProfileSubmit {
  profileId?: number,
  email: string,
  name: string,
  phone: string,
  hourlySalary: number,
  location: { city: string, state: string },
  technologies: { id: number, score: number }[],
  professionalInformation: { id: number, value: string }[],
  workingHoursIds: number[],
  workingShiftIds: number[]
}

export interface ProfileResult {
  updated: boolean,
  created: boolean,
  deleted: boolean
}

export interface ProfileList {
  id: number,
  name: string,
  email: string,
  phone: string,
}

interface Location {
  locationId: number,
  city: string,
  state: string
}

interface UserTechnologies {
  score: number,
  technologyId: number,
  userProfileId: number,
  technology: Technology
}

interface UserProfessionalInformation {
  professionalInformationId: number,
  userProfileId: number,
  value: string,
  professionalInformation: ProfessionalInformation
}

interface UserDailyWorkingHours {
  dailyWorkingHoursId: number,
  userProfileId: number,
  dailyWorkingHours: DailyWorkingHours
}

interface UserWorkingShifts {
  userProfileId: number,
  workingShiftId: number,
  workingShift: WorkingShift
}

