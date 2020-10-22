using EasyTalents.Data;
using EasyTalents.Models;
using EasyTalents.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using EasyTalents.Services;

namespace EasyTalents.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILocationReposotory _locationRepository;
        private readonly IUserProfessionalInformationRepository _uProInfoRepository;
        private readonly IUserTechnologiesRepository _uTechsRepository;
        private readonly IUserWorkingShiftsRepository _uwShiftsRepository;
        private readonly IUserWorkingHoursRepository _uwHoursRepository;

        public UserRepository(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager,
            ILocationReposotory locationReposotory, IUserProfessionalInformationRepository uProInfoRepository,
            IUserTechnologiesRepository uTechsRepository, IUserWorkingShiftsRepository uwsRepository,
            IUserWorkingHoursRepository uwhRepository)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _locationRepository = locationReposotory;
            _uProInfoRepository = uProInfoRepository;
            _uTechsRepository = uTechsRepository;
            _uwShiftsRepository = uwsRepository;
            _uwHoursRepository = uwhRepository;
        }

        public async Task<UserProfile> CreateUserDataAsync(UserForm userForm, string userId)
        {
            // create a new userProfile
            UserProfile newProfile = await CreateUserProfile(userForm, userId);
            // Don't attempt to save the rest of the data if the profile has not been created
            if (newProfile == null) return null;
            // create the other user related entities
            _uProInfoRepository.Create(userForm.ProfessionalInformation, newProfile.UserProfileId);
            await _uTechsRepository.CreateAsync(userForm.Technologies, newProfile.UserProfileId);
            _uwHoursRepository.Create(userForm.WorkingHoursIds, newProfile.UserProfileId);
            _uwShiftsRepository.Create(userForm.WorkingShiftIds, newProfile.UserProfileId);
            return newProfile;
        }

        public async Task<UserProfile> CreateUserProfile(UserForm userForm, string userId)
        {
            UserProfile CreatedProfile = new UserProfile();
            // check if profile with current user already exists
            UserProfile userProfile = await _dbContext.UserProfiles.SingleOrDefaultAsync(up => up.AppUserId == userId);
            if (userProfile == null)
            {
                // get locationId
                int locationId = await _locationRepository.GetLocationIdAsync(userForm.Location);
                // create new profile
                UserProfile newUserProfile = new UserProfile()
                {
                    AppUserId = userId,
                    Name = userForm.Name,
                    Email = userForm.Email,
                    Phone = userForm.Phone,
                    LocationId = locationId,
                    HourlySalary = userForm.HourlySalary,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                CreatedProfile = _dbContext.UserProfiles.Add(newUserProfile).Entity;
                _ = _dbContext.SaveChanges();
            }
            else
            {
                AppException.Throw(nameof(UserRepository), nameof(CreateUserProfile), AppExceptionMessage.UserHasProfile);
            }
            return CreatedProfile;
        }

        public async Task<UserProfile> UpdateUserDataAsync(UserForm userForm, string userId)
        {
            UserProfile updatedProfile = await UpdateUserProfile(userForm, userId);
            // Don't attempt to update the other tables if profile has not been updated
            if (updatedProfile == null) return null;
            // update other user related entities
            _uProInfoRepository.UpdateCreateRemove(userForm.ProfessionalInformation, updatedProfile.UserProfileId);
            await _uTechsRepository.UpdateAsync(userForm.Technologies, updatedProfile.UserProfileId);
            _uwHoursRepository.Update(userForm.WorkingHoursIds, updatedProfile.UserProfileId);
            _uwShiftsRepository.Update(userForm.WorkingShiftIds, updatedProfile.UserProfileId);
            return updatedProfile;
        }

        private async Task<UserProfile> UpdateUserProfile(UserForm userForm, string userId)
        {
            // check if there is a profile for the logged in user
            UserProfile userProfile = await _dbContext.UserProfiles.SingleOrDefaultAsync(up => up.AppUserId == userId);
            if (userProfile != null)
            {
                // get locationId
                int locationId = await _locationRepository.GetLocationIdAsync(userForm.Location);
                // update profile data
                UserProfile updatedProfile = new UserProfile();
                userProfile.AppUserId = userId;
                userProfile.Name = userForm.Name;
                userProfile.Email = userForm.Email;
                userProfile.Phone = userForm.Phone;
                userProfile.LocationId = locationId;
                userProfile.HourlySalary = userForm.HourlySalary;
                userProfile.UpdatedAt = DateTime.UtcNow;
                updatedProfile = _dbContext.UserProfiles.Update(userProfile).Entity;
                _ = _dbContext.SaveChanges();
                return updatedProfile;
            }
            else return null;
        }

        public async Task<List<ProfileList>> GetProfilesAsync()
        {
            UserProfile[] userProfiles = await _dbContext.UserProfiles.ToArrayAsync();
            List<ProfileList> profileList = UserService.CreateProfileList(userProfiles);
            return profileList;
        }

        public async Task<UserProfile> GetProfileByIdAsync(int id)
        {
            // use Find/FindAsync instead of SingleOrDefault becaused Find will not make a call to the database
            // if the entity is already been tracked
            UserProfile userProfile = await _dbContext.UserProfiles.FindAsync(id);
            return userProfile;
        }

        public async Task<UserProfile> GetProfileAsync(string userId)
        {
            UserProfile userProfile = await _dbContext.UserProfiles.SingleOrDefaultAsync(up => up.AppUserId == userId);
            return userProfile;
        }

        public async Task<IList<string>> GetRolesAsync(string userId)
        {
            ApplicationUser user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);
            IList<string> userRoles = await _userManager.GetRolesAsync(user);
            return userRoles;
        }

        public async Task<UserProfile> DeleteUserAsync(string userId)
        {
            UserProfile userProfile = await _dbContext.UserProfiles.SingleOrDefaultAsync(up => up.AppUserId == userId);
            if (userProfile != null)
            {
                UserProfile result = _dbContext.UserProfiles.Remove(userProfile).Entity;
                _ = _dbContext.SaveChanges();
                return result;
            }
            return null;
        }
    }
}
