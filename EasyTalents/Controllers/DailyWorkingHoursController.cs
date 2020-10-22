using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EasyTalents.Models;
using EasyTalents.Repositories;

namespace EasyTalents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DailyWorkingHoursController : ControllerBase
    {
        private readonly ILogger<DailyWorkingHoursController> _logger;
        private readonly IDailyWorkingHoursRepository _workingHoursRepository;

        public DailyWorkingHoursController(ILogger<DailyWorkingHoursController> logger,
            IDailyWorkingHoursRepository workingHoursRepository)
        {
            _logger = logger;
            _workingHoursRepository = workingHoursRepository;
        }

        [HttpGet]
        public ActionResult<DailyWorkingHours[]> GetAll()
        {
            try
            {
                DailyWorkingHours[]  workingHours = _workingHoursRepository.Get();
                return workingHours == null ? NotFound() : (ActionResult)Ok(workingHours);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(GetAll)} => {nameof(DailyWorkingHoursController)}");
                return StatusCode(500);
            }
        }
    }
}
