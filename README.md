# ITTalents

This repo is composed of two projects: a unit test project called 'UnitTest' and the main project called
'EasyTelents'. It also contains the Visual Studio solution for both projects a license file and this README.md file.


# EasyTalents Project

## Description
The main project 'EasyTelents' is a talent bank for developers. It allows a user to register and create a profile with personal and professional information.
It also has default 'Admin' user that can list the the developers.


## Technical details

This project has been developed from a template that creates a basic structure and a built-in authentication/authorization system.
I have only made some small changes in the authorization guard to restrict access by roles.

The template for this project has been created following this guide:
https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-3.1

The project is composed of a front-end built with AngularJS and a RESTFull API built with .NET Core 3.1.

### API
- The database model is created using Entity Framework Core 3.1 with a Database Context and Data Models.
- The database is created/updated using Migrations.
- The database is accessed using the repository pattern through the Controllers.
- The data is retrieved from the database using the lazy-loading technique.
- The API uses the NLog package to log errors and information to files.

### Front-end
- The pages are styled with Bootstrap and Angular Material.
- The form are built with reactive forms.
- There is an exception handler system that logs front-end errors to the API.


## How to use it

Follow the bellow guides to run this project in your machine


## 1 - On Windows 10

Perform the actions bellow in the right order.


### 1.1 - Get the project repository to your machine:

- Clone with Git or download it and unzip.


### 1.2 - Install the necessary tools in your machine:

- Node.js
	- Download: https://nodejs.org/en/download/
	- Run the wizard and install everything that is suggested.
- Visual Studio Community 2019
	- Download: https://visualstudio.microsoft.com/pt-br/vs/community/
	- Visual Studio has an Installer that lets you choose what's going to be installed. Make sure it installs 'ASP.NET and Web development'
and 'Node.js development'.
- Microsoft Sql Server Express 2019
	- Download: https://www.microsoft.com/en-us/download/details.aspx?id=55994
	- Run the wizard and install the basic version.
	- After the installation is finished copy the connection string in the instalation window for latter use.
* Obs: if you don't find the tools on the links above, search for the name on the internet and you will surely find it.


### 1.3 - Configure the database connection

- The 'EasyTalents' project is configured to use SqLite and SqlServer.
- The default behaviour is to use a SqlServer connection.
- If you are going to use Microsoft Sql Server Express you don't need to make any changes, just create the database.
- To use a different Sql Server:
	- Open the project solution with Visual Studio.
	- Open appsettings.json file in the root of 'EasyTalents' project and change the connection string value of
the 'DefaultConnection' property inside 'ConnectionStrings' object.
	- Install your database provider with NuGet.
- To use SqLite database go to Startup.cs file in 'EasyTalents' root and change the database connection in 'ConfigureServices' method.
Inside 'services.AddDbContext' call:
	- Replace the method call 'options.UseSqlServer' for 'options.UseSqlite' keeping the rest the same;
	- In 'Configuration.GetConnectionString' method call, replace the parameter 'DefaultConnection' for 'SqliteConnection';
	- Ex: 
		Change this: options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")).UseLazyLoadingProxies(),
		to this: options.UseSqlite(Configuration.GetConnectionString("SqliteConnection")).UseLazyLoadingProxies()


### 1.4 - Create the database
	1. Open the projects Solution with Visual Studio
	2. Open the Package Manager Console - PMC (it can be found in View menu of Visual Studio).
	3. Make sure 'EasyTalents' is the default project inside PMC window bar.
	4. Type 'Update-Database' and hit enter. If everything goes right you should see a 'Done' output in the console.


### 1.5 - Build 'EasyTalents' project
- Go to 'EasyTalents' project file, right click it and choose the 'build' option it the pop-up menu.
	- This will install the project depencies with npm package manager for the Angular client (this will take a while).
	- When the build is finished you can run the project.


### 1.6 - Run 'EasyTalents' project

	1. Open Visual Studio
	2. Right click on 'EasyTalents' project folder and choose 'Set as Startup Project'
	3. On Visual Studio go to 'Debug' menu on top and choose 'Start without debuggin' or use the shortcut Ctrl + F5
	Obs: if a client timeout error is shown on the browser, refresh the page. Sometimes it happens when when the process exceeds the
time limits.


### 1.7 - Run the Tests

- Run API tests:
	1. Open Visual Studio
	2. Build 'EasyTalents' project
	3. Build 'UnitTest' project
	4. Go to 'UnitTest' project file right click on it and choose 'Run Tests'

- Run 'EasyTalents' tests:
	1. Open Visual Studio
	2. Open a Terminal (on Visual Studio 'View' menu)
	3. On Terminal navigate to 'ClientApp'
	4. Type the command: 'npm run test'


# License & copyright

© Alan D Oliveira

Licensed under the [MIT License](LICENSE.txt).


