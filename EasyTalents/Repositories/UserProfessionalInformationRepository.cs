using Castle.Core.Internal;
using EasyTalents.Data;
using EasyTalents.Models;
using EasyTalents.ViewModels;
using EasyTalents.Services;
using System.Linq;

namespace EasyTalents.Repositories
{
    public class UserProfessionalInformationRepository : IUserProfessionalInformationRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public UserProfessionalInformationRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void UpdateCreateRemove(ProfessionalInformationInput[] professionalInformation, int profileId)
        {
            Update(professionalInformation, profileId);
            Create(professionalInformation, profileId);
            Remove(professionalInformation, profileId);
        }

        public void Create(ProfessionalInformationInput[] professionalInformation, int profileId)
        {
            foreach (ProfessionalInformationInput infoInput in professionalInformation)
            {
                // check if the information exists
                ProfessionalInformation professionalInfo = _dbContext.ProfessionalInformation.SingleOrDefault(pi => 
                    pi.ProfessionalInformationId == infoInput.Id);
                if (professionalInfo == null)
                {
                    AppException.Throw(nameof(UserProfessionalInformationRepository), nameof(Create), AppExceptionMessage.NotExist);
                }
                // create new user information if it does not exist
                UserProfessionalInformation userInformation = GetUserProfessionalInfo(infoInput.Id, profileId);
                if (userInformation == null)
                {
                    UserProfessionalInformation newUserInformation = new UserProfessionalInformation()
                    {
                        UserProfileId = profileId,
                        ProfessionalInformationId = infoInput.Id,
                        Value = infoInput.Value
                    };
                    _ = _dbContext.UserProfessionalInformation.Add(newUserInformation);
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private void Update(ProfessionalInformationInput[] professionalInformation, int profileId)
        {
            foreach (ProfessionalInformationInput info in professionalInformation)
            {
                // check if incoming data exists in the database and update if it does
                UserProfessionalInformation userInformation = GetUserProfessionalInfo(info.Id, profileId);
                if (userInformation != null)
                {
                    userInformation.Value = info.Value;
                    _ = _dbContext.UserProfessionalInformation.Update(userInformation);
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private void Remove(ProfessionalInformationInput[] professionalInformation, int profileId)
        {
            // get all ProfessionalInformation data
            ProfessionalInformation[] infoList = _dbContext.ProfessionalInformation.ToArray();
            foreach(ProfessionalInformation info in infoList)
            {
                // check if there is info that is on the database but was not submitted and remove it
                ProfessionalInformationInput submittedInfo = professionalInformation.Find(pi => pi.Id == info.ProfessionalInformationId);
                if (submittedInfo == null)
                {
                    UserProfessionalInformation userInfo = GetUserProfessionalInfo(info.ProfessionalInformationId, profileId);
                    if (userInfo != null)
                    {
                        _ = _dbContext.UserProfessionalInformation.Remove(userInfo);
                    }
                }
            }
            _ = _dbContext.SaveChanges();
        }

        private UserProfessionalInformation GetUserProfessionalInfo(int infoId, int profileId)
        {
            return _dbContext.UserProfessionalInformation.
            SingleOrDefault(upi => upi.ProfessionalInformationId == infoId && upi.UserProfileId == profileId);
        }
    }
}
