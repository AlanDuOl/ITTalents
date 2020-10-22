using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using EasyTalents.ViewModels;

namespace EasyTalents.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ErrorController : ControllerBase
    {
        private readonly ILogger<ErrorController> _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Consumes("application/json")]
        public IActionResult LogErrors([FromBody]FrontEndError frontEndError)
        {
            try
            {
                _logger.LogError($"{nameof(FrontEndError)}: {frontEndError.Type} at {frontEndError.Path} with message: ${frontEndError.Message}");
                return StatusCode(201);
            }
            catch(Exception)
            {
                return StatusCode(500);
            }
        }
    }
}
