
namespace EasyTalents.Repositories
{
    public interface IUserWorkingShiftsRepository
    {
        void Create(int[] workingShiftIds, int profileId);
        void Update(int[] workingShiftIds, int profileId);
    }
}
