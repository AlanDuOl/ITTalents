using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EasyTalents.Models;
using EasyTalents.Repositories;
using EasyTalents.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EasyTalents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserController> _logger;

        public AdminController(ILogger<UserController> logger, IUserRepository userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
        }

        [HttpGet("List")]
        public async Task<ActionResult<List<ProfileList>>> GetProfilesAsync()
        {
            try
            {
                Claim userId = User.FindFirst(ClaimTypes.NameIdentifier);
                IList<string> userRoles = await _userRepository.GetRolesAsync(userId.Value);
                bool isAdmin = userRoles.Contains("Admin");
                if (isAdmin)
                {
                    List<ProfileList> profileList = await _userRepository.GetProfilesAsync();
                    return Ok(profileList);
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"${nameof(AdminController)} error at ${nameof(GetProfilesAsync)}");
                return StatusCode(500);
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<ActionResult<UserProfile>> GetProfileByIdAsync(int id)
        {
            UserProfile userProfile = new UserProfile();
            try
            {
                Claim userId = User.FindFirst(ClaimTypes.NameIdentifier);
                IList<string> userRoles = await _userRepository.GetRolesAsync(userId.Value);
                bool isAdmin = userRoles.Contains("Admin");
                if (isAdmin)
                {
                    userProfile = await _userRepository.GetProfileByIdAsync(id);
                    return userProfile == null ? NotFound() : (ActionResult)Ok(userProfile);
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"${nameof(AdminController)} error at ${nameof(GetProfileByIdAsync)}");
                return StatusCode(500);
            }
        }
    }
}
