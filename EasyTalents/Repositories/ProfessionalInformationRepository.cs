using EasyTalents.Data;
using EasyTalents.Models;
using System.Linq;

namespace EasyTalents.Repositories
{
    public class ProfessionalInformationRepository : IProfessionalInformationRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ProfessionalInformationRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public ProfessionalInformation[] Get()
        {
            ProfessionalInformation[] professionalInformation = _dbContext.ProfessionalInformation.ToArray();
            return professionalInformation;
        }
    }
}
