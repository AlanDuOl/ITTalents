using EasyTalents.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using EasyTalents.Services;

namespace EasyTalents.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        #region Methods
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // When overriding call base method first
            base.OnModelCreating(modelBuilder);
            CreateCompositeKeys(modelBuilder);
            // Seed database tables that have initial entities
            DbSeeder.SeedDbCreation(modelBuilder);
        }

        private void CreateCompositeKeys(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserProfessionalInformation>().HasKey(upi => new { upi.UserProfileId, upi.ProfessionalInformationId });
            modelBuilder.Entity<UserTechnologies>().HasKey(ut => new { ut.UserProfileId, ut.TechnologyId });
            modelBuilder.Entity<UserWorkingShift>().HasKey(uws => new { uws.UserProfileId, uws.WorkingShiftId });
            modelBuilder.Entity<UserDailyWorkingHours>().HasKey(udwh => new { udwh.UserProfileId, udwh.DailyWorkingHoursId });
        }
        #endregion

        #region DbSets
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<ProfessionalInformation> ProfessionalInformation { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<DailyWorkingHours> DailyWorkingHours { get; set; }
        public DbSet<WorkingShift> WorkingShifts { get; set; }
        public DbSet<UserProfessionalInformation> UserProfessionalInformation { get; set; }
        public DbSet<UserTechnologies> UserTechnologies { get; set; }
        public DbSet<UserDailyWorkingHours> UserDailyWorkingHours { get; set; }
        public DbSet<UserWorkingShift> UserWorkingShifts { get; set; }
        #endregion
    }
}
