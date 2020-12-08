# ITTalents
This project is composed of two projects: a unit test project called 'UnitTest' and the main project called 'EasyTelents'.

## EasyTalents Project
The main project 'EasyTelents' is a talent bank for developers. It allows a user to register and create a profile with personal and professional information.

## Project details
This project has been developed from a template that creates a basic structure and a built-in authentication/authorization system. I have only made some small changes in the authorization guard to restrict access by roles and added some functions to the authorization service.

The template for this project has been created following this guide:
'https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-3.1'.

The project is composed of a front-end built with Angular.js and a RESTful API built with .NET Core 3.1.

### API
- The database model is created using Entity Framework Core 3.1 with a Database Context and Data Models.
- The database is created/updated using Migrations.
- The database is accessed using the repository pattern through the Controllers.
- The data is retrieved from the database using the lazy-loading technique.
- The API uses the NLog package to log errors and information to files.

### Front-end
- The pages are styled with Bootstrap and Angular Material.
- The forms are built with reactive forms.
- There is an exception handler system that logs front-end errors to the API.

## How to use it
Follow the bellow guide in the right order to run this project in your machine.

### 1 - Windows 10
You need basic understanding of Windows to follow this guide.

### 1.1 - Get the project repository to your machine
- Choose one of the two options bellow:
	- Download the project:
		- Access the project with this link 'https://github.com/AlanDuOl/ITTalents'.
		- Locate a green button called 'Code' in the '<> Code' menu.
		- Click the 'Code' button and click the option 'Download ZIP' inside the pop-up menu. This will download the project to your machine in a compressed format (.zip).
		- Extract the downloaded file. It will generate a folder called 'ITTalents-main'.
	- Clone the project with Git (advanced):
		- Install Git in your machine if you don't have it already.
		- With Git installed, right click inside a folder of your choice and select 'Git Bash Here' in the pop-up menu or open 'Git Bash' in the Windows start menu and navigate to the folder path of your choice.
		- Inside Git Bash Terminal type 'git clone https://github.com/AlanDuOl/ITTalents.git'. This will create a folder called 'ITTalents'.

### 1.2 - Install tools in your machine
 - Node.js:
	- Download: https://nodejs.org/en/download/.
	- Run the wizard and install everything that is suggested.
	- When Node.js installation finish, a prompt window will open to install chocolatey (a software needed to install dependencies for Node.js). Just hit space key twice and the installation will proceed to new window 'PowerShell'.
	- When the installation in PowerShell is finished type 'ENTER' and hit enter key to finish.
 - Visual Studio Community 2019:
	- Download: https://visualstudio.microsoft.com/pt-br/vs/community/.
	- Visual Studio has an Installer that lets you choose what's going to be installed. Make sure it installs 'ASP.NET and Web development', 'Node.js development' and 'Python'.
 - Microsoft Sql Server Express 2019 (skip this if you want to use a different database - see section 1.3):
	- Download: 'https://www.microsoft.com/en-us/Download/details.aspx?id=101064'.
	- Run the wizard and install the basic version.
	- After the installation is finished copy the connection string in the instalation window for latter use.
 * Obs: if you don't find the tools on the links above, search on the internet and you will surely find them.

### 1.3 - Open the project with Visual Studio
 - Open the folder you created in section 1 ('ITTalents' or 'ITTalents-main').
 - Double click 'EasyTalents.sln' file inside the folder.
 - Wait for the project to load on Visual Studio (you should see a 'ready' message on the bottom left of Visual Studio).

### 1.4 - Configure the database connection
 - Default configuration:
	- The default configuration is set to use a SqlServer connection.
	- If you are going to use Microsoft Sql Server Express you don't need to make any changes, jump to section 1.4.
 - To use a SQL Server other than Microsoft Sql Server Express:
	- Open 'appsettings.json' file in the root of 'EasyTalents' project and change the connection string value of the 'DefaultConnection' property inside 'ConnectionStrings' object to target you server connection.
	- Install your database provider in 'EasyTalents' project with NuGet.
 - To use SqLite database:
	- Open Startup.cs file in 'EasyTalents' root.
	- Locate the 'ConfigureServices' method.
	- Inside 'ConfigureServices' locate 'services.AddDbContext' call.
	- Inside 'services.AddDbContext' replace 'options.UseSqlServer' for 'options.UseSqlite' keeping the rest the same.
	- Inside 'options.UseSqlServer' locate 'Configuration.GetConnectionString' method call and replace the parameter 'DefaultConnection' for 'SqliteConnection'.
		- Example: 
			Change this: options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")).UseLazyLoadingProxies(),
			to this: options.UseSqlite(Configuration.GetConnectionString("SqliteConnection")).UseLazyLoadingProxies().

### 1.5 - Create the database
 - Check if the server is running:
	- Open 'SQL Server 2019 Configuration Manager':
		- Type 'SQL Server 2019 Configuration Manager' in windows start menu and click the icon that appears.
	- Select 'SQL Server Services' at the top left.
	- On the right side of the window locate 'SQL Server (SQLEXPRESS)' under the column 'name'.
	- Check if the value under the 'state' column for 'SQL Server (SQLEXPRESS)' is 'Running', if not, right click it and choose 'Start' on the pop-up menu.
 - Inside Visual Studio:
	- Open the 'Package Manager Console' (PMC):
		- Go to 'View' menu of Visual Studio, locate the option 'Other Windows' and put the mouse pointer over it.
		- Inside 'Other Windows' pop-up menu locate the option 'Package Manager Console' and click it:
			- A Terminal window should open.
			- The Terminal will allow you to type commands when a cursor is visible.
	- On 'Package Manager Console' Terminal window:
		- Make sure 'EasyTalents' is the default project inside PMC window bar (top right).
		- Inside the PMC window type the command 'Update-Database' and hit enter key:
			- If everything goes right you should see the following output inside the PMC window:
				- 'Build started'
				- 'Build succeeded'
				- 'Done'
			- Obs: it takes some time to complete.

### 1.6 - Build 'EasyTalents' project
 - Inside Visual Studio:
	- Open 'Solutions Explorer' window:
		- On Visual Studio 'View' menu click the option 'Solutions Explorer' to open it (if nothing happens it is probably already opened).
		- Locate the 'Solutions Explorer' window. It is usually in the left side of Visual Studio.
	- Right click on 'EasyTalents' inside the 'Solutions Explorer' window and choose the 'Build' option in the pop-up menu:
		- This will open a window in the bottom of Visual Studio where you can see some outputs.
		- This will install the project dependencies for the Angular client (this will take a while).
		- When the build is finished you can run the project.

### 1.7 - Run 'EasyTalents' project
 - Inside Visual Studio:
	- Inside 'Solutions Explorer' window:
		- Right click on 'EasyTalents' inside the 'Solutions Explorer' window and choose 'Set as Startup Project' in the pop-up menu.
	- Go to 'Debug' menu and choose 'Start without debuggin' or use the shortcut 'Ctrl + F5'. A browser window will open and the project will run on it.
		- If a security warning about an SSL certificate is shown:
			- Click 'Yes' and then click 'Yes' again on the new window.
	* Obs: if a client timeout error is shown on the browser, refresh the page. Sometimes it happens when the process exceeds the time limit.

### 1.8 - Run Tests
- Run API tests:
	- Inside Visual Studio:
		- Inside 'Solutions Explorer' window:
			- Right click on 'UnitTest' inside the 'Solutions Explorer' window and choose 'Build'.
			- Wait for the build to finish.
			- Right click on 'UnitTest' inside the 'Solutions Explorer' window and choose 'Run Tests'.
			- A window will open where you can see the tests result.

- Run Front-end tests:
	- Inside Visual Studio:
		- On Visual Studio 'View' menu look for an option called 'Terminal' and click it.
		- A window will open. It allow you to type commands when a cursor is visible.
		- Type the command 'cd EasyTalents/ClientApp' and hit enter key.
	 	- Type the command 'npm run test' and hit enter key. This will run the testes after some time.
		- You can also see the tests result inside the 'Terminal' window.
		- When the tests run a browser window should open. You can see the results there too.
		* Obs: if the browser window does not open it's probably because your browser is configured not to accept allow it.

## How to use it
The project Home page has a detailed tutorial on how to use the project.

# License & copyright

© Alan D Oliveira

Licensed under the [MIT License](LICENSE.txt).


