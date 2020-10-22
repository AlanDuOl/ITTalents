using EasyTalents.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace UnitTest.TestServices
{
    [TestClass]
    public class AppExceptionTest
    {
        [TestMethod]
        public void TestExceptionMessages()
        {
            // arrange
            string expectedNotExist = "No entity was found with the given information";
            string expectedProfileConflict = "The given profile is not from the current ApplicationUser";
            string expectedUserHasProfile = "The given user already has a profile";

            // assert
            Assert.AreEqual(expectedNotExist, AppExceptionMessage.NotExist);
            Assert.AreEqual(expectedProfileConflict, AppExceptionMessage.ProfileConflict);
            Assert.AreEqual(expectedUserHasProfile, AppExceptionMessage.UserHasProfile);
        }

        [TestMethod]
        public void TestExceptionThrow()
        {
            // arrange
            string className = "TestClass";
            string methodName = "TestMethod";
            string message = "TestMessage";
            string expectedMessage = $"{message} at {className} => {methodName}";
            // act
            try
            {
                AppException.Throw(className, methodName, message);
                // this should not run
                Assert.IsTrue(false);
            }
            catch (Exception ex)
            {
                Assert.IsTrue(ex is ApplicationException);
                Assert.AreEqual(expectedMessage, ex.Message);
            }
        }
    }
}
