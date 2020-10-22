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
    public class TechnologyControllerTest
    {
        private readonly FakeLogger<TechnologyController> _logger;
        private readonly FakeTechnologyRepository _technologyRepository;

        public TechnologyControllerTest()
        {
            _logger = new FakeLogger<TechnologyController>();
            _technologyRepository = new FakeTechnologyRepository();
        }

        [TestMethod]
        public void TestGetAllSuccess()
        {
            // arrange
            TechnologyController controller = new TechnologyController(_logger, _technologyRepository);
            Technology[] expectedResult = FakeData.GetTechnologies();

            // act
            ActionResult<Technology[]> actionResult = controller.GetAll();
            OkObjectResult okResult = actionResult.Result as OkObjectResult;
            Technology[] result = okResult.Value as Technology[];

            // assert
            for (int index = 0; index < expectedResult.Length; index++)
            {
                Assert.AreEqual(expectedResult[index].TechnologyId, result[index].TechnologyId);
                Assert.AreEqual(expectedResult[index].Description, result[index].Description);
                Assert.AreEqual(expectedResult[index].Required, result[index].Required);
            }
        }

        [TestMethod]
        public void TestLogErrorsNotFoundError()
        {
            // if repository.Get returns null a NotFound response should be returned
            // arrange
            FakeTechnologyRepository repository = new FakeTechnologyRepository()
            {
                Technologies = null
            };
            TechnologyController controller = new TechnologyController(_logger, repository);
            NotFoundResult expectedResult = controller.NotFound();
            // act
            ActionResult<Technology[]> actionResult = controller.GetAll();
            ActionResult result = actionResult.Result;

            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public void TestLogErrorsServerError()
        {
            // if an error happens a server error 500 should be returned
            // arrange
            var mock = new Mock<ILogger<TechnologyController>>();
            FakeTechnologyRepositoryError repository = new FakeTechnologyRepositoryError();
            TechnologyController controller = new TechnologyController(mock.Object, repository);

            // act
            ActionResult<Technology[]> actionResult = controller.GetAll();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int statusCode = result.StatusCode;

            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
    }
}
