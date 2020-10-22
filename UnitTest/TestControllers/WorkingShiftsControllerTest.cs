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
    public class WorkingShiftsControllerTest
    {
        private readonly FakeLogger<WorkingShiftsController> _logger;
        private readonly FakeWorkingShiftsRepository _workingShiftsRepository;

        public WorkingShiftsControllerTest()
        {
            _logger = new FakeLogger<WorkingShiftsController>();
            _workingShiftsRepository = new FakeWorkingShiftsRepository();
        }

        [TestMethod]
        public void TestGetAllSuccess()
        {
            // arrange
            WorkingShiftsController controller = new WorkingShiftsController(_logger, _workingShiftsRepository);
            WorkingShift[] expectedResult = FakeData.GetWorkingShifts();

            // act
            ActionResult<WorkingShift[]> actionResult = controller.GetAll();
            OkObjectResult okResult = actionResult.Result as OkObjectResult;
            WorkingShift[] result = okResult.Value as WorkingShift[];

            // assert
            for (int index = 0; index < expectedResult.Length; index++)
            {
                Assert.AreEqual(expectedResult[index].WorkingShiftId, result[index].WorkingShiftId);
                Assert.AreEqual(expectedResult[index].Description, result[index].Description);
            }
        }

        [TestMethod]
        public void TestLogErrorsNotFoundError()
        {
            // if repository.Get returns null a NotFound response should be returned
            // arrange
            FakeWorkingShiftsRepository repository = new FakeWorkingShiftsRepository()
            {
                WorkingShifts = null
            };
            WorkingShiftsController controller = new WorkingShiftsController(_logger, repository);
            NotFoundResult expectedResult = controller.NotFound();

            // act
            ActionResult<WorkingShift[]> actionResult = controller.GetAll();
            ActionResult result = actionResult.Result;

            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public void TestLogErrorsServerError()
        {
            // if an error happens a server error 500 should be returned
            // arrange
            var mock = new Mock<ILogger<WorkingShiftsController>>();
            FakeWorkingShiftsRepositoryError repository = new FakeWorkingShiftsRepositoryError();
            WorkingShiftsController controller = new WorkingShiftsController(mock.Object, repository);

            // act
            ActionResult<WorkingShift[]> actionResult = controller.GetAll();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int statusCode = result.StatusCode;

            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
    }
}
