using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using EasyTalents.Models;
using NLog.Web;

namespace EasyTalents.Services
{
    public static class DbSeeder
    {
        public static void SeedDbCreation(ModelBuilder modelBuilder)
        {
            var _logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            try
            {
                // SeedRoles must be called before SeedUsers
                SeedRoles(modelBuilder);
                SeedDailyWorkingHours(modelBuilder);
                SeedProfessionalInformation(modelBuilder);
                SeedTechnologies(modelBuilder);
                SeedWorkingShifts(modelBuilder);
            }
            catch (Exception ex)
            {
                _logger.Error($"Database seeding: ${ex.Message}");
            }
        }

        public static void SeedDailyWorkingHours(ModelBuilder modelBuilder)
        {
            // Default workig hours
            string[] workigHours = { "Up to 4", "4 to 6", "6 to 8", "Over 8", "Weekends" };
            int id = 1;

            foreach (string hours in workigHours)
            {
                modelBuilder.Entity<DailyWorkingHours>().HasData(
                    new DailyWorkingHours
                    {
                        DailyWorkingHoursId = id,
                        Description = hours,
                    }
                );
                id++;
            }
        }

        public static void SeedProfessionalInformation(ModelBuilder modelBuilder)
        {
            // Default professional information
            string[] infoList = { "Skype", "Linkedin", "Portfolio", "LinkCrud", "OtherTechnology" };
            int id = 1;

            foreach (string info in infoList)
            {
                if (info == "Skype")
                {
                    modelBuilder.Entity<ProfessionalInformation>().HasData(
                        new ProfessionalInformation
                        {
                            ProfessionalInformationId = id,
                            Description = info,
                            Required = true
                        }
                    );
                }
                else
                {
                    modelBuilder.Entity<ProfessionalInformation>().HasData(
                        new ProfessionalInformation
                        {
                            ProfessionalInformationId = id,
                            Description = info,
                            Required = false
                        }
                    );
                }
                id++;
            }
        }

        public static void SeedRoles(ModelBuilder modelBuilder)
        {
            // Default roles
            string[] roleNames = { "Admin", "User" };

            foreach (string roleName in roleNames)
            {
                modelBuilder.Entity<IdentityRole>().HasData(
                    new IdentityRole
                    {
                        Name = roleName,
                        NormalizedName = roleName.ToUpper()
                    }
                );
            }
        }

        public static void SeedTechnologies(ModelBuilder modelBuilder)
        {
            string[] technologyNames =
            {
                "React JS", "React Native", "Android", "Flutter", "SWIFT", "IOS", "HTML", "CSS", "Bootstrap", "Jquery",
                "Angular Js1", "Angular", "Java", "Python", "Flask", "Asp.Net MVC", "Asp.Net Web Form", "C", "C#", "NodeJs",
                "Express-NodeJs", "Cake", "Django", "Majento", "PHP", "Vue", "Wordpress", "Ruby", "MySql Server", "MySql", "Salesforce",
                "Photoshop", "Illustrator", "SEO", "Laravel"
            };
            int id = 1;

            foreach(string techName in technologyNames)
            {
                modelBuilder.Entity<Technology>().HasData(new Technology
                {
                    TechnologyId = id,
                    Description = techName,
                    Required = true
                });
                id++;
            }
        }

        public static void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            string userEmail = "bo@gmail.com";

            if (userManager.FindByEmailAsync(userEmail).Result == null)
            {
                ApplicationUser user = new ApplicationUser
                {
                    UserName = userEmail,
                    Email = userEmail,
                    EmailConfirmed = true
                };

                IdentityResult result = userManager.CreateAsync(user, "Ab123/4").Result;

                if (result.Succeeded)
                {
                    IdentityResult addToRoleResult = userManager.AddToRoleAsync(user, "Admin").Result;
                    if (!addToRoleResult.Succeeded)
                    {
                        foreach (IdentityError error in addToRoleResult.Errors)
                        {
                            logger.Error($"Adding role to seed user: ${error}");
                        }
                    }
                }
                else
                {
                    foreach (IdentityError error in result.Errors)
                    {
                        logger.Error($"Creating seed user: ${error}");
                    }
                }
            }
        }

        public static void SeedWorkingShifts(ModelBuilder modelBuilder)
        {
            // Default working shifts
            string[] workingShifts = { "Morning", "Afternoon", "Night", "Dawn", "Business" };
            int id = 1;
            foreach (string shift in workingShifts)
            {
                modelBuilder.Entity<WorkingShift>().HasData(
                    new WorkingShift
                    {
                        WorkingShiftId = id,
                        Description = shift,
                    }
                );
                id++;
            }
        }
    }
}
