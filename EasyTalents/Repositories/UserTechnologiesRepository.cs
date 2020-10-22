using EasyTalents.Data;
using EasyTalents.Models;
using EasyTalents.Services;
using EasyTalents.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace EasyTalents.Repositories
{
    public class UserTechnologiesRepository : IUserTechnologiesRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public UserTechnologiesRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(TechnologyInput[] technologies, int profileId)
        {
            foreach (TechnologyInput input in technologies)
            {
                // check if technology exists
                Technology technology = await _dbContext.Technologies.SingleOrDefaultAsync(tech => 
                tech.TechnologyId == input.Id);
                if (technology == null)
                {
                    AppException.Throw(nameof(UserTechnologiesRepository), nameof(CreateAsync), AppExceptionMessage.NotExist);
                }
                // create user technologies if it does not exist
                UserTechnologies userTechnologies = await GetUserTechnologiesAsync(input.Id, profileId);
                if (userTechnologies == null)
                {
                    UserTechnologies newUserTechnologies = new UserTechnologies()
                    {
                        UserProfileId = profileId,
                        TechnologyId = technology.TechnologyId,
                        Score = input.Score
                    };
                    _ = _dbContext.UserTechnologies.Add(newUserTechnologies);
                }
            }
            _ = _dbContext.SaveChanges();
        }

        public async Task UpdateAsync(TechnologyInput[] technologies, int profileId)
        {
            foreach (TechnologyInput tech in technologies)
            {
                // check if userTechnology exists
                UserTechnologies userTechnologies = await GetUserTechnologiesAsync(tech.Id, profileId);
                // Update if it exists
                if (userTechnologies != null)
                {
                    userTechnologies.Score = tech.Score;
                    _ = _dbContext.UserTechnologies.Update(userTechnologies);
                }
                else
                {
                    AppException.Throw(nameof(UserTechnologiesRepository), nameof(UpdateAsync), AppExceptionMessage.NotExist);
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private async Task<UserTechnologies> GetUserTechnologiesAsync(int techId, int profileId)
        {
            return await _dbContext.UserTechnologies.SingleOrDefaultAsync(utech =>
                    utech.TechnologyId == techId && utech.UserProfileId == profileId);
        }
    }
}
