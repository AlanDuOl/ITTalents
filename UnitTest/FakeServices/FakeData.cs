using EasyTalents.Models;

namespace UnitTest.FakeServices
{
    public static class FakeData
    {
        public static DailyWorkingHours[] GetWorkingHours()
        {
            DailyWorkingHours[] dailyWorkingHours = new DailyWorkingHours[]
            { 
                new DailyWorkingHours()
                {
                    DailyWorkingHoursId = 1,
                    Description = "Morning",
                },
                new DailyWorkingHours()
                {
                    DailyWorkingHoursId = 2,
                    Description = "Afternoon",
                },
            };
            return dailyWorkingHours;
        }

        public static WorkingShift[] GetWorkingShifts()
        {
            WorkingShift[] workingShifts = new WorkingShift[]
            {
                new WorkingShift()
                {
                    WorkingShiftId = 1,
                    Description = "Shift1",
                },
                new WorkingShift()
                {
                    WorkingShiftId = 2,
                    Description = "Shift2",
                },
            };
            return workingShifts;
        }

        public static ProfessionalInformation[] GetProfessionalInformation()
        {
            ProfessionalInformation[] professionalInformation = new ProfessionalInformation[]
            {
                new ProfessionalInformation()
                {
                    ProfessionalInformationId = 1,
                    Description = "Info1",
                    Required = true
                },
                new ProfessionalInformation()
                {
                    ProfessionalInformationId = 2,
                    Description = "Info2",
                    Required = false
                },
            };
            return professionalInformation;
        }

        public static Technology[] GetTechnologies()
        {
            Technology[] technologies = new Technology[]
            {
                new Technology()
                {
                    TechnologyId = 1,
                    Description = "Tech1",
                    Required = true
                },
                new Technology()
                {
                    TechnologyId = 2,
                    Description = "Tech2",
                    Required = false
                }
            };
            return technologies;
        }
    }
}
