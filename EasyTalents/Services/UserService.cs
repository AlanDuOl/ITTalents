using System.Collections.Generic;
using EasyTalents.ViewModels;
using EasyTalents.Models;

namespace EasyTalents.Services
{
    public static class UserService
    {
        public static List<ProfileList> CreateProfileList(UserProfile[] userProfiles)
        {
            List<ProfileList> profileList = new List<ProfileList>();
            foreach(UserProfile userProfile in userProfiles)
            {
                ProfileList profile = new ProfileList()
                {
                    Id = userProfile.UserProfileId,
                    Name = userProfile.Name,
                    Email = userProfile.Email,
                    Phone = userProfile.Phone
                };
                profileList.Add(profile);
            }
            return profileList;
        }
    }
}
