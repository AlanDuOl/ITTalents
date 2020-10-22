using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using EasyTalents.Controllers;
using EasyTalents.Models;
using Microsoft.AspNetCore.Mvc;
using UnitTest.FakeServices;
using UnitTest.FakeRepositories;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using EasyTalents.ViewModels;

namespace UnitTest.TestControllers
{
    [TestClass]
    public class UserControllerTest
    {
        private readonly FakeLogger<UserController> _logger;
        private readonly FakeUserRepositorySuccess _userRepository;
        private readonly FakeUserRepositoryError _userRepositoryError;
        private readonly ControllerContext _controllerContext;

        public UserControllerTest()
        {
            _logger = new FakeLogger<UserController>();
            _userRepository = new FakeUserRepositorySuccess();
            _userRepositoryError = new FakeUserRepositoryError();
            _controllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = FakeClaimsPrincipal.Get()
                }
            };
        }

        #region Test GetProfileAsync
        [TestMethod]
        public async Task TestGetProfileAsyncShouldReturnAProfile()
        {
            UserProfile expectedUserProfile = FakeUserData.GetProfile();
            UserController userController = new UserController(_logger, _userRepository)
            {
                ControllerContext = _controllerContext
            };
            ActionResult<UserProfile> actionResult = await userController.GetProfileAsync();
            OkObjectResult result = actionResult.Result as OkObjectResult;
            UserProfile userProfile = result.Value as UserProfile;
            // assert
            Assert.AreEqual(expectedUserProfile.AppUserId, userProfile.AppUserId);
            Assert.AreEqual(expectedUserProfile.Email, userProfile.Email);
            Assert.AreEqual(expectedUserProfile.HourlySalary, userProfile.HourlySalary);
            Assert.AreEqual(expectedUserProfile.LocationId, userProfile.LocationId);
            Assert.AreEqual(expectedUserProfile.Name, userProfile.Name);
            Assert.AreEqual(expectedUserProfile.Phone, userProfile.Phone);
        }

        [TestMethod]
        public async Task TestGetProfileAsyncShouldReturnError1()
        {
            // If an exception is thrown a status code 500 should be returned
            // Not setting User in ControllerContext throws an error
            UserController userController = new UserController(_logger, _userRepository);
            ActionResult<UserProfile> actionResult = await userController.GetProfileAsync();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int status = result.StatusCode;
            // assert
            Assert.AreEqual(status, 500);
        }

        [TestMethod]
        public async Task TestGetProfileAsyncShouldReturnError2()
        {
            // If an exception is thrown a status code 500 should be returned
            // and logger should be called
            var mock = new Mock<ILogger<UserController>>();
            // calling repository that will throw and error
            UserController userController = new UserController(mock.Object, _userRepositoryError)
            {
                ControllerContext = _controllerContext
            };
            ActionResult<UserProfile> actionResult = await userController.GetProfileAsync();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int status = result.StatusCode;
            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(status, 500);
        }
        #endregion

        #region Test GetUserRolesAsync
        [TestMethod]
        public async Task TestGetUserRolesAsync()
        {
            IList<string> expectedRoles = FakeUserData.GetRoles();
            UserController userController = new UserController(_logger, _userRepository)
            {
                ControllerContext = _controllerContext
            };
            ActionResult<IList<string>> actionResult = await userController.GetUserRolesAsync();
            OkObjectResult result = actionResult.Result as OkObjectResult;
            IList<string> userRoles = result.Value as IList<string>;
            // assert
            Assert.AreEqual(expectedRoles.Count, userRoles.Count);
            for (int index = 0; index < userRoles.Count; index++)
            {
                Assert.AreEqual(expectedRoles[index], userRoles[index]);
            }
        }

        [TestMethod]
        public async Task TestGetUserRolesAsyncError1()
        {
            // If an exception is thrown a status code 500 should be returned
            IList<string> expectedRoles = new List<string>() { "Admin" };
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserRoles = expectedRoles
            };
            // Not setting User.Identity throws error
            UserController userController = new UserController(_logger, userRepository);
            ActionResult<IList<string>> actionResult = await userController.GetUserRolesAsync();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int status = result.StatusCode;
            // assert
            Assert.AreEqual(status, 500);
        }

        [TestMethod]
        public async Task TestGetUserRolesAsyncError2()
        {
            // If an exception is thrown a status code 500 should be returned
            // and logger should be called
            var mock = new Mock<ILogger<UserController>>();
            // calling repository that will throw and error
            UserController userController = new UserController(mock.Object, _userRepositoryError)
            {
                ControllerContext = _controllerContext
            };
            ActionResult<UserProfile> actionResult = await userController.GetProfileAsync();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int status = result.StatusCode;
            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(status, 500);
        }
        #endregion

        #region Test CreateAsync
        [TestMethod]
        public async Task TestCreateAsyncSuccess()
        {
            // if user in not 'Admin' and data is correct, a profile should be created
            UserForm formData = FakeUserData.GetFormData();
            UserController userController = new UserController(_logger, _userRepository)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.CreateAsync(formData);
            CreatedAtActionResult createResult = actionResult as CreatedAtActionResult;
            RequestResult result = createResult.Value as RequestResult;
            // assert
            Assert.IsTrue(result.Created);
            Assert.IsFalse(result.Updated);
            Assert.IsFalse(result.Deleted);
        }

        [TestMethod]
        public async Task TestCreateAsyncError1()
        {
            // if userRoles contains 'Admin' the used should not be allowed to create a profile
            IList<string> userRoles = new List<string>() { "Admin" };
            UserForm formData = FakeUserData.GetFormData();
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserRoles = userRoles
            };
            UserController userController = new UserController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            ForbidResult expectedResult = userController.Forbid();
            IActionResult result = await userController.CreateAsync(formData);
            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public async Task TestCreateAsyncError2()
        {
            // if repository.CreateUserData returns null a 500 error should be returned
            UserForm formData = FakeUserData.GetFormData();
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserProfile = null
            };
            UserController userController = new UserController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.CreateAsync(formData);
            StatusCodeResult result = actionResult as StatusCodeResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(statusCode == 500);
        }

        [TestMethod]
        public async Task TestCreateAsyncError3()
        {
            // any error thrown should return a 500 error response
            // and logger should be called
            var mock = new Mock<ILogger<UserController>>();
            UserForm formData = FakeUserData.GetFormData();
            // any function in _userRepositoryError will throw and error
            UserController userController = new UserController(mock.Object, _userRepositoryError)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.CreateAsync(formData);
            StatusCodeResult result = actionResult as StatusCodeResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
        #endregion

        #region Test UpdateAsync
        [TestMethod]
        public async Task TestUpdateAsyncSuccess()
        {
            // if user in not 'Admin' and data is correct, a profile should be updated
            // and RequestResult should have the correct values
            UserForm formData = FakeUserData.GetFormData();
            UserController userController = new UserController(_logger, _userRepository)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.UpdateAsync(formData);
            OkObjectResult createResult = actionResult as OkObjectResult;
            RequestResult result = createResult.Value as RequestResult;
            // assert
            Assert.IsFalse(result.Created);
            Assert.IsTrue(result.Updated);
            Assert.IsFalse(result.Deleted);
        }

        [TestMethod]
        public async Task TestUpdateAsyncError1()
        {
            // if userRoles contains 'Admin', user should not be allowed to updated a profile
            IList<string> userRoles = new List<string>() { "Admin" };
            UserForm formData = FakeUserData.GetFormData();
            // instanciate repository with UserRoles with 'Admin' role
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserRoles = userRoles
            };
            UserController userController = new UserController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            ForbidResult expectedResult = userController.Forbid();
            IActionResult result = await userController.UpdateAsync(formData);
            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public async Task TestUpdateAsyncError2()
        {
            // if repository.UpdateAsync returns null a 404 error should be returned
            UserForm formData = FakeUserData.GetFormData();
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserProfile = null
            };
            UserController userController = new UserController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.UpdateAsync(formData);
            NotFoundResult result = actionResult as NotFoundResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(statusCode == 404);
        }

        [TestMethod]
        public async Task TestUpdateAsyncError3()
        {
            // any error thrown should return a 500 error response
            // and logger should be called
            var mock = new Mock<ILogger<UserController>>();
            UserForm formData = FakeUserData.GetFormData();
            // any function in _userRepositoryError will throw and error
            UserController userController = new UserController(mock.Object, _userRepositoryError)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.UpdateAsync(formData);
            StatusCodeResult result = actionResult as StatusCodeResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
        #endregion

        #region Test DeleteUserAsync
        [TestMethod]
        public async Task TestDeleteUserAsyncSuccess()
        {
            // if request is correct a profile should be removed
            // and RequestResult should have the correct values
            UserController userController = new UserController(_logger, _userRepository)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.DeleteUserAsync();
            OkObjectResult createResult = actionResult as OkObjectResult;
            RequestResult result = createResult.Value as RequestResult;
            // assert
            Assert.IsFalse(result.Created);
            Assert.IsFalse(result.Updated);
            Assert.IsTrue(result.Deleted);
        }

        [TestMethod]
        public async Task TestDeleteUserAsyncError1()
        {
            // if repository.DeleteUserAsync returns null a 404 error should be returned
            FakeUserRepositorySuccess userRepository = new FakeUserRepositorySuccess()
            {
                UserProfile = null
            };
            UserController userController = new UserController(_logger, userRepository)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.DeleteUserAsync();
            NotFoundResult result = actionResult as NotFoundResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(statusCode == 404);
        }

        [TestMethod]
        public async Task TestDeleteUserAsyncError2()
        {
            // any error thrown should return a 500 error response
            // and logger should be called
            var mock = new Mock<ILogger<UserController>>();
            // any function in _userRepositoryError will throw and error
            UserController userController = new UserController(mock.Object, _userRepositoryError)
            {
                ControllerContext = _controllerContext
            };
            IActionResult actionResult = await userController.DeleteUserAsync();
            StatusCodeResult result = actionResult as StatusCodeResult;
            int statusCode = result.StatusCode;
            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
        #endregion
    }
}
