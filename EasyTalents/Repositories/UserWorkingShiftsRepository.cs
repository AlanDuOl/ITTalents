using EasyTalents.Data;
using EasyTalents.Models;
using EasyTalents.Services;
using System;
using System.Linq;

namespace EasyTalents.Repositories
{
    public class UserWorkingShiftsRepository : IUserWorkingShiftsRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public UserWorkingShiftsRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Update(int[] workingShiftIds, int profileId)
        {
            Create(workingShiftIds, profileId);
            Remove(workingShiftIds, profileId);
        }

        public void Create(int[] workingShiftIds, int profileId)
        {
            foreach (int id in workingShiftIds)
            {
                // check if the workingShift exists
                WorkingShift workingShift = _dbContext.WorkingShifts.SingleOrDefault(ws => ws.WorkingShiftId == id);
                if (workingShift == null)
                {
                    AppException.Throw(nameof(UserWorkingShiftsRepository), nameof(Create), AppExceptionMessage.NotExist);
                }
                // create user working shift if it does not exist
                UserWorkingShift uws = GetUserWorkingShift(workingShift.WorkingShiftId, profileId);
                if (uws == null)
                {
                    UserWorkingShift userWorkingShift = new UserWorkingShift()
                    {
                        UserProfileId = profileId,
                        WorkingShiftId = workingShift.WorkingShiftId
                    };
                    _ = _dbContext.UserWorkingShifts.Add(userWorkingShift);
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private void Remove(int[] workingShiftIds, int profileId)
        {
            // get all ProfessionalInformation data
            WorkingShift[] workingShiftList = _dbContext.WorkingShifts.ToArray();
            foreach (WorkingShift shift in workingShiftList)
            {
                // check if there are info that are on the database but was not submitted
                bool wasSubmitted = workingShiftIds.Contains(shift.WorkingShiftId);
                if (!wasSubmitted)
                {
                    // if the not submitted data already has been saved in userWorkingShift table, remove it
                    UserWorkingShift userWorkingShift = GetUserWorkingShift(shift.WorkingShiftId, profileId);
                    if (userWorkingShift != null)
                    {
                        _ = _dbContext.UserWorkingShifts.Remove(userWorkingShift);
                    }
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private UserWorkingShift GetUserWorkingShift(int workingShiftId, int profileId)
        {
            return _dbContext.UserWorkingShifts.SingleOrDefault(uws =>
                uws.WorkingShiftId == workingShiftId && uws.UserProfileId == profileId);
        }
    }
}
