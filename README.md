# ITTalents
This repo is composed of two projects: a unit test project called 'UnitTest' and the main project called
'EasyTelents'. It also contains the Visual Studio solution for both projects a license file and this README.md file.

## EasyTalents Project
The main project 'EasyTelents' is a talent bank for developers. It allows a user to register and create a profile with personal and professional information.
It also has default 'Admin' user that can list the developers.

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
Follow the bellow guide in the right order to run this project in your machine.

## Windows 10
You need basic understanding of Windows to follow this guide.

### 1 - Get the project repository to your machine
- Choose one of the two options bellow:
	1. Clone the project with Git:
		1. Choose or create a folder to save the project.
		2. Install Git in your machine if you don't have it already:
			- Download Git installer an run it (link: https://git-scm.com/download/win).
			*Obs: If you don't find Git in the above link, search in the web and you will find it.
		3. Open Git Terminal:
			- With Git installed, right click inside the folder form step 1 and choose 'Git Bash Here' in the pop-up menu or open 'Git Bash' in the Windows start menu and navigate to the folder path of step 1.
		4. Clone the project:
			- Inside Git Bash Terminal type 'git clone https://github.com/AlanDuOl/ITTalents.git'. This will create a folder called 'ITTalents'.
	2. Download the project:
		- On project repository (https://github.com/AlanDuOl/ITTalents):
			1. Locate a green button called 'Code' in the '<> Code' menu.
			2. Click the 'Code' button and click the option 'Download ZIP' inside the pop-up menu. This will download the project to your machine in a compressed format (.zip).
			3. Uncompress the project file. It will generate a folder called 'ITTalents-main'.

### 1.1 - Install tools in your machine
- Requirements:
	- You need admin rights to install the tools.
- Tools to install:
	- Node.js:
		- Download: https://nodejs.org/en/download/.
		- Run the wizard and install everything that is suggested.
		- When Node.js installation finish, a prompt window will open to install chocolatey (a software needed to install dependencies for Node.js). Just hit any key twice and the installation will proceed to new window 'PowerShell'.
		- When the installation in PowerShell is finished type ENTER and hit enter to finish.
	- Visual Studio Community 2019:
		- Download: https://visualstudio.microsoft.com/pt-br/vs/community/.
		- Visual Studio has an Installer that lets you choose what's going to be installed. Make sure it installs 'ASP.NET and Web development', 'Node.js development' and 'Python'.
	- Microsoft Sql Server Express 2019 (skip this if you want to use a different database - see section 1.3):
		- Download: https://www.microsoft.com/en-us/Download/details.aspx?id=101064
		- Run the wizard and install the basic version.
		- After the installation is finished copy the connection string in the instalation window for latter use.
	* Obs: if you don't find the tools on the links above, search on the internet and you will surely find them.

### 1.2 - Open the project with Visual Studio
- Open the project:
	1. Open the folder 'ITTalents'.
	2. Double click 'EasyTalents.sln' file inside the 'ITTalents' folder.
	3. Wait for the project to load on Visual Studio (you should see a 'ready' message on the bottom left of Visual Studio).

### 1.3 - Configure the database connection
- Default configuration:
	- The default configuration is set to use a SqlServer connection.
	- If you are going to use Microsoft Sql Server Express you don't need to make any changes, jump to section 1.4.
- To use a SQL Server other than Microsoft Sql Server Express:
	- Open 'appsettings.json' file in the root of 'EasyTalents' project and change the connection string value of the 'DefaultConnection' property inside 'ConnectionStrings' object to target you server connection.
	- Install your database provider in 'EasyTalents' with NuGet or Package Manage Console.
- To use SqLite database:
	1. Open Startup.cs file in 'EasyTalents' root
	2. Locate the 'ConfigureServices' method.
	3. Inside 'ConfigureServices' locate 'services.AddDbContext' call.
	4. Inside 'services.AddDbContext' replace 'options.UseSqlServer' for 'options.UseSqlite' keeping the rest the same.
	5. Inside 'options.UseSqlServer' locate 'Configuration.GetConnectionString' method call and replace the parameter 'DefaultConnection' for 'SqliteConnection'.
		- Example: 
			Change this: options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")).UseLazyLoadingProxies(),
			to this: options.UseSqlite(Configuration.GetConnectionString("SqliteConnection")).UseLazyLoadingProxies().

### 1.4 - Create the database
	1. Open the project (section 1.2).
	2. Check if the server is running:
		1. Open 'SQL Server 2019 Configuration Manager':
			- Type 'SQL Server 2019 Configuration Manager' in windows start menu and click the icon that appears.
		2. Select 'SQL Server Services' at the top left.
		3. On the right side of the window locate 'SQL Server (SQLEXPRESS)' under the column 'name'.
		4. Check if the state for 'SQL Server (SQLEXPRESS)' is 'Running', if not, right click it and choose 'Start' on the pop-up menu.
	2. Open the 'Package Manager Console' (PMC):
		1. Go to 'View' menu of Visual Studio, locate the option 'Other Windows' and put the mouse pointer over it.
		2. Inside 'Other Windows' pop-up menu locate the option 'Package Manager Console' and click it:
			- A Terminal window should open.
			- The Terminal will allow you to type commands when a cursor is visible.
	3. On 'Package Manager Console' Terminal window:
		1. Make sure 'EasyTalents' is the default project inside PMC window bar (top right).
		2. Inside the PCM window type the command 'Update-Database' and hit enter:
			- If everything goes right you should see a 'Done' output inside the PCM window after some time.

### 1.5 - Build 'EasyTalents' project
	1. Open the project (section 1.2).
	2. Open 'Solutions Explorer' window:
		- On Visual Studio 'View' menu click the option 'Solutions Explorer' to open it.
	3. Right click on 'EasyTalents' inside the 'Solutions Explorer' window and choose the 'Build' option in the pop-up menu:
		- This will install the project depencies with npm package manager for the Angular client (this will take a while)
		- When the build is finished you can run the project.

### 1.6 - Run 'EasyTalents' project
	1. Open the project (section 1.2).
	2. Open 'Solutions Explorer' window:
		- On Visual Studio 'View' menu click the option 'Solutions Explorer' to open it.
	3. Set the project as default project:
		- Right click on 'EasyTalents' inside the 'Solutions Explorer' window and choose 'Set as Startup Project' in the pop-up menu.
	4. Run the project:
		- On Visual Studio go to 'Debug' menu and choose 'Start without debuggin' or use the shortcut Ctrl + F5.
		Obs: if a client timeout error is shown on the browser, refresh the page. Sometimes it happens when the process exceeds the time limit.

### 1.7 - Run Tests
- Run API tests:
	1. Open the project (section 1.2).
	2. Open 'Solutions Explorer' window:
		- On Visual Studio 'View' menu click the option 'Solutions Explorer' to open it.
	3. Build 'EasyTalents' project (If you completed section 1.5 you can skip this):
		- Right click on 'EasyTalents' inside the 'Solutions Explorer' window and choose 'Build'.
	4. Build 'UnitTest' project:
		- Right click on 'UnitTest' inside the 'Solutions Explorer' window and choose 'Build'.
	5. Run tests:
		- Right click on 'UnitTest' inside the 'Solutions Explorer' window and choose 'Run Tests'.

- Run Front-end tests:
	1. Open the project (section 1.2).
	2. Open a Terminal:
		- On Visual Studio 'View' menu look for an option called 'Terminal' and click it.
		- A window will open. It allow you to type commands when a cursor is visible.
	3. On Terminal window:
		1. Type the command 'cd EasyTalents/ClientApp' and hit enter.
	 	2. Type the command 'npm run test' and hit enter. This will run the testes after some time.
	4. View test results:
		- When the tests run a browser window will be opened. You can see the results there.
		- You can also see the test results inside the 'Terminal' window.

# License & copyright

© Alan D Oliveira

Licensed under the [MIT License](LICENSE.txt).


