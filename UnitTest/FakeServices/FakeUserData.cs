using EasyTalents.Models;
using EasyTalents.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest.FakeServices
{
    public static class FakeUserData
    {
        public static UserProfile GetProfile()
        {
            UserProfile fakeProfile = new UserProfile()
            {
                UserProfileId = 1,
                AppUserId = "ABCD",
                Name = "User 1",
                Email = "abc@abc.com",
                Phone = "123456789",
                HourlySalary = 12,
                LocationId = 1,
                CreatedAt = new DateTime(2020, 10, 10),
                UpdatedAt = new DateTime(2020, 10, 21)
            };
            return fakeProfile;
        }

        public static List<ProfileList> GetProfiles()
        {
            List<ProfileList> profiles = new List<ProfileList>()
            {
                new ProfileList()
                {
                    Name = "fake1",
                    Email = "fake1@abc.com",
                    Id = 1,
                    Phone = "112458679"
                },
                new ProfileList()
                {
                    Name = "fake2",
                    Email = "fake2@abc.com",
                    Id = 2,
                    Phone = "112458679"
                },
                new ProfileList()
                {
                    Name = "fake3",
                    Email = "fake3@abc.com",
                    Id = 3,
                    Phone = "112458679"
                }
            };
            return profiles;
        }

        public static UserForm GetFormData()
        {
            UserForm formData = new UserForm()
            {
                Email = "abc@abc.com",
                Name = "abc",
                HourlySalary = 12,
                Phone = "123456789"
            };
            return formData;
        }

        public static IList<string> GetRoles()
        {
            List<string> userRoles = new List<string>() { "user" };
            return userRoles;
        }
    }
}
