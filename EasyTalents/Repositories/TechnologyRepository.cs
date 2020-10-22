using EasyTalents.Models;
using EasyTalents.Data;
using System.Linq;

namespace EasyTalents.Repositories
{
    public class TechnologyRepository : ITechnologyRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public TechnologyRepository(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public Technology[] Get()
        {
            Technology[] technologies = _applicationDbContext.Technologies.ToArray();
            return technologies;
        }
    }
}
