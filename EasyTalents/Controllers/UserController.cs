using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyTalents.ViewModels;
using EasyTalents.Models;
using EasyTalents.Repositories;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace EasyTalents.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger, IUserRepository userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
        }

        [HttpGet("Get")]
        public async Task<ActionResult<UserProfile>> GetProfileAsync()
        {
            try
            {
                Claim userId = User.FindFirst(ClaimTypes.NameIdentifier);
                UserProfile userProfile = await _userRepository.GetProfileAsync(userId.Value);
                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(UserController)} => {nameof(GetProfileAsync)}");
                return StatusCode(500);
            }
        }

        [HttpGet("GetRoles")]
        public async Task<ActionResult<IList<string>>> GetUserRolesAsync()
        {
            try
            {
                Claim userId = User.FindFirst(ClaimTypes.NameIdentifier);
                IList<string> userRoles = await _userRepository.GetRolesAsync(userId.Value);
                return Ok(userRoles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(UserController)} => {nameof(GetUserRolesAsync)}");
                return StatusCode(500);
            }
        }

        [HttpPost("Create")]
        [Consumes("application/json")]
        public async Task<IActionResult> CreateAsync([FromBody] UserForm userForm)
        {
            try
            {
                Claim userId = User.FindFirst(ClaimTypes.NameIdentifier);
                IList<string> userRoles = await _userRepository.GetRolesAsync(userId.Value);
                bool isAdmin = userRoles.Contains("Admin");
                if (!isAdmin)
                {
                    UserProfile userProfile = await _userRepository.CreateUserDataAsync(userForm, userId.Value);
                    RequestResult requestResult = new RequestResult(true, false, false);
                    return userProfile == null ? StatusCode(500) : (ActionResult)CreatedAtAction(nameof(CreateAsync), requestResult);
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(UserController)} => {nameof(CreateAsync)}");
                return StatusCode(500);
            }
        }

        [HttpPut("Update")]
        [Consumes("application/json")]
        public async Task<IActionResult> UpdateAsync([FromBody] UserForm userForm)
        {
            try
            {
                Claim userId = User.FindFirst(ClaimTypes.NameIdentifier);
                IList<string> userRoles = await _userRepository.GetRolesAsync(userId.Value);
                bool isAdmin = userRoles.Contains("Admin");
                if (!isAdmin)
                {
                    UserProfile userProfile = await _userRepository.UpdateUserDataAsync(userForm, userId.Value);
                    RequestResult requestResult = new RequestResult(false, false, true);
                    return userProfile == null ? NotFound() : (ActionResult)Ok(requestResult);
                }
                else
                {
                    return Forbid();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(UserController)} => {nameof(UpdateAsync)}");
                return StatusCode(500);
            }
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteUserAsync()
        {
            try
            {
                Claim userId = User.FindFirst(ClaimTypes.NameIdentifier);
                UserProfile profile = await _userRepository.DeleteUserAsync(userId.Value);
                RequestResult requestResult = new RequestResult(false, true, false);
                return profile == null ? NotFound() : (ActionResult)Ok(requestResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Api error at {nameof(UserController)} => {nameof(DeleteUserAsync)}");
                return StatusCode(500);
            }
        }
    }
}
