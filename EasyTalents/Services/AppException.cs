using System;

namespace EasyTalents.Services
{
    public static class AppExceptionMessage
    {
        public static string NotExist = "No entity was found with the given information";
        public static string ProfileConflict = "The given profile is not from the current ApplicationUser";
        public static string UserHasProfile = "The given user already has a profile";
    }

    public static class AppException
    {
        public static void Throw(string className, string methodName, string message)
        {
            throw new ApplicationException($"{message} at {className} => {methodName}");
        }
    }
}
