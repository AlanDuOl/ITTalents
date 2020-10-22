using System.Collections.Generic;
using System.Threading.Tasks;
using EasyTalents.Models;
using EasyTalents.ViewModels;

namespace EasyTalents.Repositories
{
    public interface IUserRepository
    {
        Task<UserProfile> CreateUserDataAsync(UserForm userForm, string userId);
        Task<UserProfile> UpdateUserDataAsync(UserForm userForm, string userId);
        Task<List<ProfileList>> GetProfilesAsync();
        Task<UserProfile> GetProfileByIdAsync(int id);
        Task<UserProfile> GetProfileAsync(string userId);
        Task<IList<string>> GetRolesAsync(string userId);
        Task<UserProfile> DeleteUserAsync(string userId);
    }
}
