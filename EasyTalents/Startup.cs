using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using EasyTalents.Services;
using EasyTalents.Data;
using EasyTalents.Models;
using EasyTalents.Repositories;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Linq;

namespace EasyTalents
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            _ = services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")).UseLazyLoadingProxies()
            );

            // Add repositories
            _ = services.AddTransient<ITechnologyRepository, TechnologyRepository>();
            _ = services.AddTransient<IDailyWorkingHoursRepository, DailyWorkingHoursRepository>();
            _ = services.AddTransient<IWorkingShiftsRepository, WorkingShiftsRepository>();
            _ = services.AddTransient<IProfessionalInformationRepository, ProfessionalInformationRepository>();
            _ = services.AddTransient<ILocationReposotory, LocationRepository>();
            _ = services.AddTransient<IUserProfessionalInformationRepository, UserProfessionalInformationRepository>();
            _ = services.AddTransient<IUserTechnologiesRepository, UserTechnologiesRepository>();
            _ = services.AddTransient<IUserWorkingShiftsRepository, UserWorkingShiftsRepository>();
            _ = services.AddTransient<IUserWorkingHoursRepository, UserWorkingHoursRepository>();
            _ = services.AddTransient<IUserRepository, UserRepository>();

            _ = services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            _ = services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            _ = services.AddAuthentication()
                .AddIdentityServerJwt();
            _ = services.AddControllersWithViews();
            _ = services.AddRazorPages();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // used to allow logging of automatic 400 responses
            // this does not return the ProblemDetails object
            _ = services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.InvalidModelStateResponseFactory = context =>
                    {
                        var logger = context.HttpContext.RequestServices
                                .GetRequiredService<ILogger<Startup>>();
                        IEnumerable<ModelError> modelErrors = context.ModelState.Values.SelectMany(v => v.Errors);
                        string erroMessage = "";
                        foreach (var modelError in modelErrors)
                        {
                            erroMessage += $"${modelError.ErrorMessage} | ";
                        }
                        logger.LogError($"BadRequest with errors: ${erroMessage}");
                        return new BadRequestObjectResult(context.ModelState);
                    };
                });

            // Add json formatter for the loading of ralated entities
            _ = services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<ApplicationUser> userManager)
        {
            if (env.IsDevelopment())
            {
                _ = app.UseDeveloperExceptionPage();
                _ = app.UseDatabaseErrorPage();
            }
            else
            {
                _ = app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                _ = app.UseHsts();
            }

            // Create seed user
            DbSeeder.SeedUsers(userManager);

            _ = app.UseHttpsRedirection();
            _ = app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            _ = app.UseRouting();

            _ = app.UseAuthentication();
            _ = app.UseIdentityServer();
            _ = app.UseAuthorization();
            _ = app.UseEndpoints(endpoints =>
            {
                _ = endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                _ = endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
