using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EasyTalents.Models;
using EasyTalents.Repositories;

namespace EasyTalents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessionalInformationController : ControllerBase
    {
        private readonly ILogger<ProfessionalInformationController> _logger;
        private readonly IProfessionalInformationRepository _professionalInformationRepository;

        public ProfessionalInformationController(ILogger<ProfessionalInformationController> logger,
            IProfessionalInformationRepository professionalInformationRepository)
        {
            _logger = logger;
            _professionalInformationRepository = professionalInformationRepository;
        }

        [HttpGet]
        public ActionResult<ProfessionalInformation[]> GetAll()
        {
            try
            {
                ProfessionalInformation[]  professionalInformation = _professionalInformationRepository.Get();
                return professionalInformation == null ? NotFound() : (ActionResult)Ok(professionalInformation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(ProfessionalInformationController)} => {nameof(GetAll)}");
                return StatusCode(500);
            }
        }
    }
}
