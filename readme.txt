1.0 Project building

To build this project you should have MongoDB Compass and NodeJS installed.

Next you should to go to project root dir and run "npm install ." command.
This command will install external project dependencies.

Last step - building project. To build actually build project you should run "npx rollup -c" command..

2.0 Run server

To run a simple NodeJS server you should just go to directory "<???>/pml30map/server" and then run "node bundle.js" command.



Addition 1.0 Server configuraition file
In "<???>/pml30map/config" folder there's server_config.json file. This file contain server configuration data, such as server port and project storage info.

server_config.info file: 
{
  "serverPort": <port of server running>,
  "useLocalStorage": true,
  "localStoragePath": <your_storage_folder>("./ftp_data" by default, necessary only if useLocalStorage enabled),
  "databaseURL": <URL of MongoDB Database>,
  "ftpStorageData": { "url": <FTP server url>, "login": <FTP server login>, "password": <FTP server password>, "root": <FTP project file storage base directory> } (necessary only if useLocalStorage disabled)
}