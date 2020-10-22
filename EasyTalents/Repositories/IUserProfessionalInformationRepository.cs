using EasyTalents.ViewModels;

namespace EasyTalents.Repositories
{
    public interface IUserProfessionalInformationRepository
    {
        void Create(ProfessionalInformationInput[] professionalInformation, int profileId);
        void UpdateCreateRemove(ProfessionalInformationInput[] professionalInformation, int profileId);
    }
}
