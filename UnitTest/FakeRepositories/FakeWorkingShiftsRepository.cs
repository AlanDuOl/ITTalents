using EasyTalents.Models;
using EasyTalents.Repositories;
using System;
using UnitTest.FakeServices;

namespace UnitTest.FakeRepositories
{
    public class FakeWorkingShiftsRepository : IWorkingShiftsRepository
    {
        public WorkingShift[] WorkingShifts { get; set; }

        public FakeWorkingShiftsRepository()
        {
            WorkingShifts = FakeData.GetWorkingShifts();
        }

        public WorkingShift[] Get()
        {
            return WorkingShifts;
        }
    }

    public class FakeWorkingShiftsRepositoryError : IWorkingShiftsRepository
    {
        public WorkingShift[] Get()
        {
            throw new NotImplementedException();
        }
    }
}
