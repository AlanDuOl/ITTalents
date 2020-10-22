using EasyTalents.Data;
using EasyTalents.Models;
using System.Linq;

namespace EasyTalents.Repositories
{
    public class DailyWorkingHoursRepository : IDailyWorkingHoursRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public DailyWorkingHoursRepository(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public DailyWorkingHours[] Get()
        {
            DailyWorkingHours[] dailyWorkingHours = _applicationDbContext.DailyWorkingHours.ToArray();
            return dailyWorkingHours;
        }
    }
}
