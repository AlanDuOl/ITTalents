using EasyTalents.Models;
using System.Threading.Tasks;
using EasyTalents.Data;
using Microsoft.EntityFrameworkCore;
using EasyTalents.ViewModels;

namespace EasyTalents.Repositories
{
    public class LocationRepository : ILocationReposotory
    {
        private readonly ApplicationDbContext _dbContext;

        public LocationRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> GetLocationIdAsync(LocationInput locationInput)
        {
            // check for location and create it if it doesn't exist
            Location location = await CreateOrGetAsync(locationInput);
            return location.LocationId;
        }

        public Location Create(Location location)
        {
            location.City = location.City.ToUpper();
            location.State = location.State.ToUpper();
            Location newLocation = _dbContext.Locations.Add(location).Entity;
            _ = _dbContext.SaveChanges();
            return newLocation;
        }

        private async Task<Location> CreateOrGetAsync(LocationInput locationInput)
        {
            // check if location already exists
            Location location = await _dbContext.Locations.SingleOrDefaultAsync(entity => 
                (entity.City == locationInput.City.ToUpper() && entity.State == locationInput.State.ToUpper()));
            // if location does not exist, create it and return
            if (location == null)
            {
                Location newLocation = new Location() { City = locationInput.City, State = locationInput.State };
                return Create(newLocation);
            }
            return location;
        }

        
    }
}
