
export interface Technology {
  technologyId: number,
  description: string,
  required: boolean
}

export interface ProfessionalInformation {
  professionalInformationId: number,
  description: string,
  required: boolean
}

export interface DailyWorkingHours {
  dailyWorkingHoursId: number,
  description: string
}

export interface WorkingShift {
  workingShiftId: number,
  description: string
}

export class FrontEndError {
  type: string;
  path: string;
  message: string;
  constructor(type: string, path: string, message: string = 'No message') {
    this.type = type;
    this.path = path;
    this.message = message;
  }
}