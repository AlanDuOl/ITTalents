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
    public class ProfessionalInformationControllerTest
    {
        private readonly FakeLogger<ProfessionalInformationController> _logger;
        private readonly FakeProfessionalInformationRepository _professionalInformationRepository;

        public ProfessionalInformationControllerTest()
        {
            _logger = new FakeLogger<ProfessionalInformationController>();
            _professionalInformationRepository = new FakeProfessionalInformationRepository();
        }

        [TestMethod]
        public void TestGetAllSuccess()
        {
            // arrange
            ProfessionalInformationController controller = 
                new ProfessionalInformationController(_logger, _professionalInformationRepository);
            ProfessionalInformation[] expectedResult = FakeData.GetProfessionalInformation();

            // act
            ActionResult<ProfessionalInformation[]> actionResult = controller.GetAll();
            OkObjectResult okResult = actionResult.Result as OkObjectResult;
            ProfessionalInformation[] result = okResult.Value as ProfessionalInformation[];

            // assert
            for (int index = 0; index < expectedResult.Length; index++)
            {
                Assert.AreEqual(expectedResult[index].ProfessionalInformationId, result[index].ProfessionalInformationId);
                Assert.AreEqual(expectedResult[index].Description, result[index].Description);
                Assert.AreEqual(expectedResult[index].Required, result[index].Required);
            }
        }

        [TestMethod]
        public void TestLogErrorsNotFoundError()
        {
            // if repository.Get returns null a NotFound response should be returned
            // arrange
            FakeProfessionalInformationRepository repository = new FakeProfessionalInformationRepository()
            {
                ProfessionalInformation = null
            };
            ProfessionalInformationController controller = new ProfessionalInformationController(_logger, repository);
            NotFoundResult expectedResult = controller.NotFound();

            // act
            ActionResult<ProfessionalInformation[]> actionResult = controller.GetAll();
            ActionResult result = actionResult.Result;

            // assert
            Assert.IsInstanceOfType(result, expectedResult.GetType());
        }

        [TestMethod]
        public void TestLogErrorsServerError()
        {
            // if an error happens a server error 500 should be returned
            // arrange
            var mock = new Mock<ILogger<ProfessionalInformationController>>();
            FakeProfessionalInformationRepositoryError repository = new FakeProfessionalInformationRepositoryError();
            ProfessionalInformationController controller = new ProfessionalInformationController(mock.Object, repository);

            // act
            ActionResult<ProfessionalInformation[]> actionResult = controller.GetAll();
            StatusCodeResult result = actionResult.Result as StatusCodeResult;
            int statusCode = result.StatusCode;

            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 500);
        }
    }
}
