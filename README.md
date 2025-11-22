# PeopleCat-WebAppPrototype
This is a prototype of a web application for PeopleCat, which showcases the
systems basic messaging system.

_PeopleCat © Nathcat 2024_

## Archiving
This project is no longer being maintained. This was a basic application meant to show the core features of PeopleCat, and it has served its purpose.

With the future changes coming to PeopleCat, it is easiest to stop maintenance on this project. For a modern PeopleCat client which will be kept up to date
with the newest PeopleCat features, please see [brooke-ec/PeopleCat-WebApp](https://github.com/brooke-ec/peoplecat-webapp/).

## Usage
To use, clone the repository, and either:
- Compile the project yourself using Intellij Idea.
- Download the [latest release jar file](https://github.com/Nathcat/PeopleCat-WebAppPrototype/releases/latest/download/PeopleCat-WebAppPrototype.jar) and run using `java -cp PeopleCat-WebAppPrototype.jar com.nathcat.peoplecat_prototype.Server`

## Config file
The server uses a configuration file to define some information it needs to
function properly, this should be places inside the `Assets` folder, be called `Server_Config.json`, and should
contain the following JSON data:

```json
{
  "php_exec_path": "Path to your installed PHP executable",
  "port": port_number_to_run_server_on
}
```
