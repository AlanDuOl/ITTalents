using EasyTalents.Models;
using EasyTalents.Services;
using EasyTalents.ViewModels;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace UnitTest.TestServices
{
    [TestClass]
    public class UserServiceTest
    {
        [TestMethod]
        public void CreateProfileListTest()
        {
            // arrange
            UserProfile[] fakeProfiles = new UserProfile[]
            {
                new UserProfile()
                {
                    UserProfileId = 1,
                    AppUserId = "USER1",
                    Name ="user1",
                    Email = "user1@email.com",
                    Phone = "123456987",
                    HourlySalary = 20,
                    LocationId = 1,
                    CreatedAt = new DateTime(2020, 10, 17),
                    UpdatedAt =new DateTime(2020, 10, 23),
                },
                new UserProfile()
                {
                    UserProfileId = 2,
                    AppUserId = "USER2",
                    Name ="user2",
                    Email = "user2@email.com",
                    Phone = "156756987",
                    HourlySalary = 25,
                    LocationId = 2,
                    CreatedAt = new DateTime(2020, 08, 17),
                    UpdatedAt =new DateTime(2020, 08, 23),
                },
            };
            List<ProfileList> expectedProfileList = new List<ProfileList>()
            {
                new ProfileList()
                {
                    Id = 1,
                    Name = "user1",
                    Email = "user1@email.com",
                    Phone = "123456987"
                },
                new ProfileList()
                {
                    Id = 2,
                    Name = "user2",
                    Email = "user2@email.com",
                    Phone = "156756987"
                }
            };

            // act
            List<ProfileList> profileList = UserService.CreateProfileList(fakeProfiles);

            // assert
            Assert.AreEqual(expectedProfileList.Count, profileList.Count);
            for (int index = 0; index < expectedProfileList.Count; index++)
            {
                Assert.AreEqual(expectedProfileList[index].Id, profileList[index].Id);
                Assert.AreEqual(expectedProfileList[index].Name, profileList[index].Name);
                Assert.AreEqual(expectedProfileList[index].Email, profileList[index].Email);
                Assert.AreEqual(expectedProfileList[index].Phone, profileList[index].Phone);
            }
        }
    }
}
