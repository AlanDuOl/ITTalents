using EasyTalents.Data;
using EasyTalents.Models;
using EasyTalents.Services;
using System;
using System.Linq;

namespace EasyTalents.Repositories
{
    public class UserWorkingHoursRepository : IUserWorkingHoursRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public UserWorkingHoursRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Update(int[] workingHoursIds, int profileId)
        {
            Create(workingHoursIds, profileId);
            Remove(workingHoursIds, profileId);
        }

        public void Create(int[] workingHoursIds, int profileId)
        {
            foreach (int id in workingHoursIds)
            {
                // check if the workingHours exist
                DailyWorkingHours workingHours = _dbContext.DailyWorkingHours.SingleOrDefault(wh => 
                wh.DailyWorkingHoursId == id);
                if (workingHours == null)
                {
                    AppException.Throw(nameof(UserWorkingHoursRepository), nameof(Create), AppExceptionMessage.NotExist);
                }
                // create user workingHours if it does not exist
                UserDailyWorkingHours uwh = GetUserWorkingHours(workingHours.DailyWorkingHoursId, profileId);
                if (uwh == null)
                {
                    UserDailyWorkingHours userWorkingHours = new UserDailyWorkingHours()
                    {
                        UserProfileId = profileId,
                        DailyWorkingHoursId = workingHours.DailyWorkingHoursId
                    };
                    _ = _dbContext.UserDailyWorkingHours.Add(userWorkingHours);
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private void Remove(int[] workingHoursIds, int profileId)
        {
            // get all data
            DailyWorkingHours[] WorkingHoursList = _dbContext.DailyWorkingHours.ToArray();
            foreach (DailyWorkingHours hours in WorkingHoursList)
            {
                // check if there are info that are on the database but was not submitted
                bool wasSubmitted = workingHoursIds.Contains(hours.DailyWorkingHoursId);
                if (!wasSubmitted)
                {
                    // if the not submitted data already has been saved in database table, remove it
                    UserDailyWorkingHours userWorkingHours = GetUserWorkingHours(hours.DailyWorkingHoursId, profileId);
                    if (userWorkingHours != null)
                    {
                        _ = _dbContext.UserDailyWorkingHours.Remove(userWorkingHours);
                    }
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private UserDailyWorkingHours GetUserWorkingHours(int workingHoursId, int profileId)
        {
            return _dbContext.UserDailyWorkingHours.SingleOrDefault(uwh =>
                uwh.DailyWorkingHoursId == workingHoursId && uwh.UserProfileId == profileId);
        }
    }
}
