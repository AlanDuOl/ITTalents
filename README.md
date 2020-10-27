# EasyTalents

# Repo Composition
This repo is composed of two projects: a unit test project used to test the back-end API called 'UnitTest' and the main project called
'EasyTelents'.
The project has a client front-end built with AngularJS and a RESTFull API backend built with .NET Core 3.1.

# Description
The main project 'EasyTelents' is talent bank for developers. It allows a user to register and create a profile with personal and profissional information.
It also has default 'Admin' user that can list the the developers.

# How to run it in your machine (for windows 10)
Perform the actions bellow in the right order

# 1 - Get the project repository to your machine:
- Clone with Git or download it and unzip.

# 2 - Install the necessary tools in your machine:
- Node.js - (https://nodejs.org/en/download/)
	- Run the wizard and install everything that is suggested.
- Visual Studio Community 2019 - (https://visualstudio.microsoft.com/pt-br/vs/community/)
	- Visual Studio has an Installer that lets you choose what's going to be installed. Make sure it installs 'ASP.NET and Web development'
and 'Node.js development'.
- Microsoft Sql Server Express 2019 - (https://www.microsoft.com/en-us/download/details.aspx?id=55994)
	- Run the wizard and install the basic version.
	- After the installation is finished copy the connection string in the instalation window for latter use
* Obs: if you don't find the tools on the links above, search for the name and you will surely find it.

# 3 - Configure the database connection
- The project is configured to use the 'DefaultConnection' in appsettings.json ConnectionStrings section
- The project is configured to use SqLite or SqlServer.
- To use SqLite database go to Startup.cs file in 'EasyTalents' root and change the database connection in ConfigureServices inside
services.AddDbContext call:
	- Replace the method call options.UseSqlServer for options.UseSqlite keeping the rest the same
	- Then inside Configuration.GetConnectionString, replace the parameter 'DefaultConnection' for 'SqliteConnection'
	- Ex: 
		Change this: options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")).UseLazyLoadingProxies()
		to this: options.UseSqlite(Configuration.GetConnectionString("SqliteConnection")).UseLazyLoadingProxies()

# 4 - Create the database
	- Open the PMC(Package Manager Console)
	- Make sure 'EasyTalents' is the default project inside PMC window bar
	- Type 'Update-Database' and press enter

# 5 - Build the projects
- Go to 'EasyTalents' project file, right click it and choose the 'build' option it the pop-up menu.
	- This will install the project depencies with npm package manager for the Angular client

# 6 - Run the project

# 7 - Run the Tests


