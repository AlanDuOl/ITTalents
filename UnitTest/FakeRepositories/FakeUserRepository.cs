using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EasyTalents.Models;
using EasyTalents.Repositories;
using EasyTalents.ViewModels;
using UnitTest.FakeServices;

namespace UnitTest.FakeRepositories
{
    public class FakeUserRepositorySuccess : IUserRepository
    {
        public IList<string> UserRoles { get; set; }
        public UserProfile UserProfile { get; set; }
        public List<ProfileList> Profiles { get; set; }

        public FakeUserRepositorySuccess()
        {
            UserProfile = FakeUserData.GetProfile();
            UserRoles = FakeUserData.GetRoles();
        }
        public Task<UserProfile> CreateUserDataAsync(UserForm userForm, string userId)
        {
            return Task.FromResult(UserProfile);
        }

        public Task<UserProfile> DeleteUserAsync(string userId)
        {
            return Task.FromResult(UserProfile);
        }

        public Task<UserProfile> GetProfileAsync(string userId)
        {
            return Task.FromResult(UserProfile);
        }

        public Task<UserProfile> GetProfileByIdAsync(int id)
        {
            return Task.FromResult(UserProfile);
        }

        public Task<List<ProfileList>> GetProfilesAsync()
        {
            return Task.FromResult(Profiles);
        }

        public Task<IList<string>> GetRolesAsync(string userId)
        {
            return Task.FromResult(UserRoles);
        }

        public Task<UserProfile> UpdateUserDataAsync(UserForm userForm, string userId)
        {
            return Task.FromResult(UserProfile);
        }
    }

    public class FakeUserRepositoryError : IUserRepository
    {
        public Task<UserProfile> CreateUserDataAsync(UserForm userForm, string userId)
        {
            throw new NotImplementedException();
        }

        public Task<UserProfile> DeleteUserAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<UserProfile> GetProfileAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<UserProfile> GetProfileByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProfileList>> GetProfilesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IList<string>> GetRolesAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<UserProfile> UpdateUserDataAsync(UserForm userForm, string userId)
        {
            throw new NotImplementedException();
        }
    }
}
