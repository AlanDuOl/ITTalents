using System.Linq;
using EasyTalents.Data;
using EasyTalents.Models;

namespace EasyTalents.Repositories
{
    public class WorkingShiftsRepository : IWorkingShiftsRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public WorkingShiftsRepository(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public WorkingShift[] Get()
        {
            WorkingShift[] workingShifts = _applicationDbContext.WorkingShifts.ToArray();
            return workingShifts;
        }
    }
}
