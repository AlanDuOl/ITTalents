using EasyTalents.ViewModels;
using System.Threading.Tasks;

namespace EasyTalents.Repositories
{
    public interface IUserTechnologiesRepository
    {
        Task CreateAsync(TechnologyInput[] technologies, int profileId);
        Task UpdateAsync(TechnologyInput[] technologies, int profileId);
    }
}
