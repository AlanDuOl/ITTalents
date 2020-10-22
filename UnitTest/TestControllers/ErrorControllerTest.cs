using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Microsoft.Extensions.Logging;
using EasyTalents.Controllers;
using Microsoft.AspNetCore.Mvc;
using EasyTalents.ViewModels;
using UnitTest.FakeServices;

namespace UnitTest.TestControllers
{
    [TestClass]
    public class ErrorControllerTest
    {
        [TestMethod]
        public void TestLogErrorsSuccess()
        {
            // arrange
            FrontEndError frontEndError = new FrontEndError()
            {
                Type = "test",
                Path = "test path",
                Message = "test error"
            };
            var mock = new Mock<ILogger<ErrorController>>();
            ErrorController errorController = new ErrorController(mock.Object);

            // act
            IActionResult actionResult = errorController.LogErrors(frontEndError);
            StatusCodeResult result = actionResult as StatusCodeResult;
            int statusCode = result.StatusCode;

            // assert
            Assert.IsTrue(mock.Invocations.Count == 1);
            Assert.AreEqual(statusCode, 201);
        }

        [TestMethod]
        public void TestLogErrorsServerError()
        {
            // if an error happen a server error 500 should be returned
            // arrange
            FrontEndError frontEndError = new FrontEndError()
            {
                Type = "test",
                Path = "test path",
                Message = "test error"
            };
            // this logger will throw and error
            FakeLoggerError<ErrorController> fakeLogger = new FakeLoggerError<ErrorController>();
            ErrorController errorController = new ErrorController(fakeLogger);

            // act
            IActionResult actionResult = errorController.LogErrors(frontEndError);
            StatusCodeResult result = actionResult as StatusCodeResult;
            int statusCode = result.StatusCode;

            // assert
            Assert.AreEqual(statusCode, 500);
        }
    }
}
