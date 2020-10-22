using System;
using EasyTalents.Models;
using EasyTalents.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EasyTalents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkingShiftsController : ControllerBase
    {
        private readonly ILogger<WorkingShiftsController> _logger;
        private readonly IWorkingShiftsRepository _workingShiftsRepository;

        public WorkingShiftsController(ILogger<WorkingShiftsController> logger,
            IWorkingShiftsRepository workingShiftsRepository)
        {
            _logger = logger;
            _workingShiftsRepository = workingShiftsRepository;
        }

        [HttpGet]
        public ActionResult<WorkingShift[]> GetAll()
        {
            try
            {
                WorkingShift[] workingShifts = _workingShiftsRepository.Get();
                return workingShifts == null ? NotFound() : (ActionResult)Ok(workingShifts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(WorkingShiftsController)} => {nameof(GetAll)}");
                return StatusCode(500);
            }
        }
    }
}
