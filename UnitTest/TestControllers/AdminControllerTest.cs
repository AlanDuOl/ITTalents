using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using EasyTalents.Controllers;
using EasyTalents.Models;
using Microsoft.AspNetCore.Mvc;
using UnitTest.FakeServices;
using UnitTest.FakeRepositories;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using EasyTalents.ViewModels;

namespace UnitTest.TestControllers
{
    [TestClass]
    public class AdminControllerTest
    {
        private readonly FakeLogger<UserController> _logger;
        private readonly FakeUserRepositorySuccess _userRepository;
        private readonly FakeUserRepositoryError _userRepositoryError;
        private readonly ControllerContext _controllerContext;
        private readonly int _profileId;

        public AdminControllerTest()
        {
            _logger = new FakeLogger<UserController>();
            _userRepository = new FakeUserRepositorySuccess()
            {
                UserRoles = new List<string>() { "Admin" },
                Profiles = FakeUserData.GetProfiles(),
                UserProfile = FakeUserData.GetProfile()
            };
            _userRepositoryError = new FakeUserRepositoryError();
            _controllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = FakeClaimsPrincipal.Get()
                }
            };
            _profileId = 1;
        }

        #region Test GetProfilesAsync
        [TestMethod]
        public async Task TestGetProfilesAsyncSuccess()
        {
            // correct call should return the expected data
            // arrange
            List<ProfileList> expectedProfiles = FakeUserData.GetProfiles();
            AdminController adminController = new AdminController(_logger, _userRepository)
            {
                ControllerContext = _controllerContext
            };
            ActionResult<List<ProfileList>> actionResult = await adminController.GetProfilesAsync();
            OkObjectResult result = actionResult.Result as OkObjectResult;
            List<ProfileList> profiles = result.Value as List<ProfileList>;
            // assert
            for (int index = 0; index < expectedProfiles.Count; index++) {
                Assert.AreEqual(expectedProfiles[index].Email, profiles[index].Email);
                Assert.AreEqual(expectedProfiles[index].Name, profiles[index].Name);
                Assert.AreEqual(expectedProfiles[index].Id, profiles[index].Id);
                Assert.AreEqual(expectedProfiles[index].Phone, profiles[index].Phone);
            }
        }

        [TestMethod]
        public async Task TestGetProfilesAsyncForbidError()
        {
            // if user role is not 'Admin', access should be forbid
            // arrange
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserRoles = new List<string>() { "User" }
            };
            AdminController adminController = new AdminController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            ForbidResult expectedResult = adminController.Forbid();
            // act
            ActionResult<List<ProfileList>> actionResult = await adminController.GetProfilesAsync();
            ActionResult result = actionResult.Result;
            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public async Task TestGetProfilesAsyncServerError()
        {
            // if an error happens logger should be used and return is status 500
            // arrange
            var mock = new Mock<ILogger<UserController>>();
            // any method from _userRepositoryError will throw and error
            AdminController adminController = new AdminController(mock.Object, _userRepositoryError)
            {
                ControllerContext = _controllerContext
            };
            // act
            Assert.IsTrue(mock.Invocations.Count == 0);
            ActionResult<List<ProfileList>> actionResult = await adminController.GetProfilesAsync();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
        #endregion

        #region Test GetProfileByIdAsync
        [TestMethod]
        public async Task TestGetProfileByIdAsyncSuccess()
        {
            // correct call should return the expected data
            // arrange
            UserProfile expectedProfile = FakeUserData.GetProfile();
            AdminController adminController = new AdminController(_logger, _userRepository)
            {
                ControllerContext = _controllerContext
            };
            // act
            ActionResult<UserProfile> actionResult = await adminController.GetProfileByIdAsync(_profileId);
            OkObjectResult result = actionResult.Result as OkObjectResult;
            UserProfile profile = result.Value as UserProfile;
            // assert
            Assert.AreEqual(expectedProfile.Email, profile.Email);
            Assert.AreEqual(expectedProfile.Name, profile.Name);
            Assert.AreEqual(expectedProfile.Phone, profile.Phone);
            Assert.AreEqual(expectedProfile.LocationId, profile.LocationId);
            Assert.AreEqual(expectedProfile.HourlySalary, profile.HourlySalary);
            Assert.AreEqual(expectedProfile.UserProfileId, profile.UserProfileId);
            Assert.AreEqual(expectedProfile.AppUserId, profile.AppUserId);
            Assert.AreEqual(expectedProfile.CreatedAt, profile.CreatedAt);
            Assert.AreEqual(expectedProfile.UpdatedAt, profile.UpdatedAt);
        }

        [TestMethod]
        public async Task TestGetProfileByIdAsyncForbidError()
        {
            // if UserRole does not contain 'Admin', access should be forbid
            // arrange
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserRoles = new List<string>() { "User" }
            };
            AdminController adminController = new AdminController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            ForbidResult expectedResult = adminController.Forbid();
            // act
            ActionResult<UserProfile> actionResult = await adminController.GetProfileByIdAsync(_profileId);
            ActionResult result = actionResult.Result;
            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public async Task TestGetProfileByIdAsyncServerError()
        {
            // if an error happens logger should be used and return is status 500
            // arrange
            var mock = new Mock<ILogger<UserController>>();
            // any method from _userRepositoryError will throw and error
            AdminController adminController = new AdminController(mock.Object, _userRepositoryError)
            {
                ControllerContext = _controllerContext
            };
            // act
            ActionResult<UserProfile> actionResult = await adminController.GetProfileByIdAsync(_profileId);
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }

        [TestMethod]
        public async Task TestGetProfileByIdAsyncNotFoundError()
        {
            // if returned profile is null return not found error 404
            // arrange
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                // make profile null and set Admin role since it is not default behaviour
                UserRoles = new List<string>() { "Admin" },
                UserProfile = null
            };
            AdminController adminController = new AdminController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            NotFoundResult expectedResult = adminController.NotFound();
            // act
            ActionResult<UserProfile> actionResult = await adminController.GetProfileByIdAsync(_profileId);
            ActionResult result = actionResult.Result;
            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }
        #endregion
    }
}
