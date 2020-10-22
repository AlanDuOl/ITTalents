using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Claims;
using System.Security.Principal;

namespace UnitTest.FakeServices
{
    public static class FakeClaimsPrincipal
    {
        public static ClaimsPrincipal Get()
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, "userId"),
                new Claim(ClaimTypes.Name, "username"),
                new Claim("name", "fakeUser")
            };
            ClaimsIdentity identity = new ClaimsIdentity(claims, "TestAuthType");
            ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(identity);
            return claimsPrincipal;
        }
    }
}
