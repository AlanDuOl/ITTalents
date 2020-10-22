
namespace EasyTalents.Repositories
{
    public interface IUserWorkingHoursRepository
    {
        void Create(int[] workingHoursIds, int profileId);
        void Update(int[] workingHoursIds, int profileId);
    }
}
