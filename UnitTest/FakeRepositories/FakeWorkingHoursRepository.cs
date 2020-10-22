using EasyTalents.Models;
using EasyTalents.Repositories;
using System;
using UnitTest.FakeServices;

namespace UnitTest.FakeRepositories
{
    public class FakeWorkingHoursRepository : IDailyWorkingHoursRepository
    {
        public DailyWorkingHours[] DailyWorkingHours { get; set; }

        public FakeWorkingHoursRepository()
        {
            DailyWorkingHours = FakeData.GetWorkingHours();
        }

        public DailyWorkingHours[] Get()
        {
            return DailyWorkingHours;
        }
    }

    public class FakeWorkingHoursRepositoryError : IDailyWorkingHoursRepository
    {
        public DailyWorkingHours[] Get()
        {
            throw new NotImplementedException();
        }
    }
}
