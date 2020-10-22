using System;
using Microsoft.Extensions.Logging;
using EasyTalents.Models;
using EasyTalents.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace EasyTalents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnologyController : ControllerBase
    {
        private readonly ILogger<TechnologyController> _logger;
        private readonly ITechnologyRepository _technologyRepository;

        public TechnologyController(ILogger<TechnologyController> logger, ITechnologyRepository technologyRepository)
        {
            _logger = logger;
            _technologyRepository = technologyRepository;
        }

        [HttpGet]
        public ActionResult<Technology[]> GetAll()
        {
            try
            {
                Technology[] technologies = _technologyRepository.Get();
                return technologies == null ? NotFound() : (ActionResult)Ok(technologies);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(TechnologyController)} => {nameof(GetAll)}");
                return StatusCode(500);
            }
        }
    }
}
