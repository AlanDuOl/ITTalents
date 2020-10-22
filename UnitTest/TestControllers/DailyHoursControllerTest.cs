using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Microsoft.Extensions.Logging;
using EasyTalents.Controllers;
using Microsoft.AspNetCore.Mvc;
using UnitTest.FakeServices;
using UnitTest.FakeRepositories;
using EasyTalents.Models;

namespace UnitTest.TestControllers
{
    [TestClass]
    public class DailyHoursControllerTest
    {
        private readonly FakeLogger<DailyWorkingHoursController> _logger;
        private readonly FakeWorkingHoursRepository _workingHoursRepository;

        public DailyHoursControllerTest()
        {
            _logger = new FakeLogger<DailyWorkingHoursController>();
            _workingHoursRepository = new FakeWorkingHoursRepository();
        }

        [TestMethod]
        public void TestGetAllSuccess()
        {
            // arrange
            DailyWorkingHoursController controller = new DailyWorkingHoursController(_logger, _workingHoursRepository);
            DailyWorkingHours[] expectedResult = FakeData.GetWorkingHours();

            // act
            ActionResult<DailyWorkingHours[]> actionResult = controller.GetAll();
            OkObjectResult okResult = actionResult.Result as OkObjectResult;
            DailyWorkingHours[] result = okResult.Value as DailyWorkingHours[];

            // assert
            for (int index = 0; index < expectedResult.Length; index++)
            {
                Assert.AreEqual(expectedResult[index].DailyWorkingHoursId, result[index].DailyWorkingHoursId);
                Assert.AreEqual(expectedResult[index].Description, result[index].Description);
            }
        }

        [TestMethod]
        public void TestLogErrorsNotFoundError()
        {
            // if repository.Get returns null a NotFound response should be returned
            // arrange
            FakeWorkingHoursRepository repository = new FakeWorkingHoursRepository()
            {
                DailyWorkingHours = null
            };
            DailyWorkingHoursController controller = new DailyWorkingHoursController(_logger, repository);
            NotFoundResult expectedResult = controller.NotFound();
            // act
            ActionResult<DailyWorkingHours[]> actionResult = controller.GetAll();
            ActionResult result = actionResult.Result;

            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public void TestLogErrorsServerError()
        {
            // if an error happens a server error 500 should be returned
            // arrange
            var mock = new Mock<ILogger<DailyWorkingHoursController>>();
            FakeWorkingHoursRepositoryError repository = new FakeWorkingHoursRepositoryError();
            DailyWorkingHoursController controller = new DailyWorkingHoursController(mock.Object, repository);

            // act
            ActionResult<DailyWorkingHours[]> actionResult = controller.GetAll();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int statusCode = result.StatusCode;

            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
    }
}
