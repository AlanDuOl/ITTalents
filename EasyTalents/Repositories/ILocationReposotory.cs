using System.Threading.Tasks;
using EasyTalents.Models;
using EasyTalents.ViewModels;

namespace EasyTalents.Repositories
{
    public interface ILocationReposotory
    {
        Location Create(Location location);
        Task<int> GetLocationIdAsync(LocationInput locationInput);
    }
}
